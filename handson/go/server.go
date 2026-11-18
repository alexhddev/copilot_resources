package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"slices"
	"strings"
)

// Token payload: base64({"role":"admin"})
const hardcodedToken = "eyJyb2xlIjoiYWRtaW4ifQ=="

// Dummy credentials — for demo purposes only
var users = []struct{ username, password string }{{"user", "pass"}}

type Server struct {
	store *OrderStore
}

func NewServer(store *OrderStore) *Server {
	return &Server{store: store}
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/daily-menu", s.getDailyMenu)
	mux.HandleFunc("GET /api/orders/{id}", s.getOrder)
	mux.HandleFunc("POST /api/orders", s.createOrder)
	mux.HandleFunc("PUT /api/orders/{id}", s.updateOrder)
	mux.HandleFunc("POST /api/login", s.login)
	mux.HandleFunc("GET /api/protected", s.requireToken(s.protected))
	mux.HandleFunc("GET /api/admin", s.admin)
	return cors(mux)
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("Access-Control-Allow-Origin", "*")
		h.Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		h.Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

type obj map[string]any

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, errName, message string) {
	writeJSON(w, status, obj{"success": false, "error": errName, "message": message})
}

func badRequest(w http.ResponseWriter, message string) {
	writeError(w, http.StatusBadRequest, "Bad request", message)
}

func extractBearerToken(r *http.Request) (string, bool) {
	return strings.CutPrefix(r.Header.Get("Authorization"), "Bearer ")
}

func (s *Server) requireToken(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token, ok := extractBearerToken(r)
		if !ok || token != hardcodedToken {
			writeError(w, http.StatusUnauthorized, "Unauthorized", "Valid token required")
			return
		}
		next(w, r)
	}
}

// decodeBody parses a JSON object request body; ok is false if it is not one.
func decodeBody(r *http.Request) (body map[string]json.RawMessage, ok bool) {
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return nil, false
	}
	return body, body != nil
}

func (s *Server) getDailyMenu(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, obj{
		"success": true,
		"data":    dailyMenu,
		"message": "Daily menu retrieved successfully",
	})
}

func (s *Server) getOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	order, ok := s.store.FindByID(id)
	if !ok {
		writeError(w, http.StatusNotFound, "Not found", fmt.Sprintf("Order with ID '%s' not found", id))
		return
	}
	writeJSON(w, http.StatusOK, obj{"success": true, "data": order, "message": "Order retrieved successfully"})
}

// parseSender returns the trimmed sender if raw is a non-empty string.
func parseSender(raw json.RawMessage) (string, bool) {
	var sender string
	if err := json.Unmarshal(raw, &sender); err != nil || strings.TrimSpace(sender) == "" {
		return "", false
	}
	return strings.TrimSpace(sender), true
}

// parseContents returns the items if raw is a non-empty array of valid items.
// When an item is invalid, itemMsg describes the problem; otherwise it is empty.
func parseContents(raw json.RawMessage) (items []OrderItem, itemMsg string, ok bool) {
	var list []map[string]any
	if err := json.Unmarshal(raw, &list); err != nil || len(list) == 0 {
		return nil, "", false
	}
	items = make([]OrderItem, 0, len(list))
	for _, item := range list {
		name, isStr := item["name"].(string)
		if !isStr || strings.TrimSpace(name) == "" {
			return nil, "Each order item must have a valid name", false
		}
		qty, isNum := item["quantity"].(float64)
		if !isNum || qty <= 0 {
			return nil, "Each order item must have a valid quantity (positive number)", false
		}
		items = append(items, OrderItem{Name: name, Quantity: qty})
	}
	return items, "", true
}

func (s *Server) createOrder(w http.ResponseWriter, r *http.Request) {
	body, ok := decodeBody(r)
	if !ok {
		badRequest(w, "Order sender is required and must be a non-empty string")
		return
	}

	sender, ok := parseSender(body["sender"])
	if !ok {
		badRequest(w, "Order sender is required and must be a non-empty string")
		return
	}

	contents, itemMsg, ok := parseContents(body["contents"])
	if !ok {
		if itemMsg == "" {
			itemMsg = "Order contents are required and must be a non-empty array"
		}
		badRequest(w, itemMsg)
		return
	}

	order := s.store.Add(sender, contents)
	writeJSON(w, http.StatusCreated, obj{"success": true, "data": order, "message": "Order created successfully"})
}

func (s *Server) updateOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if _, exists := s.store.FindByID(id); !exists {
		writeError(w, http.StatusNotFound, "Not found", fmt.Sprintf("Order with ID '%s' not found", id))
		return
	}

	body, ok := decodeBody(r)
	if !ok {
		body = map[string]json.RawMessage{}
	}

	var sender, status *string
	var contents []OrderItem

	if raw, present := body["sender"]; present {
		v, valid := parseSender(raw)
		if !valid {
			badRequest(w, "Order sender must be a non-empty string")
			return
		}
		sender = &v
	}

	if raw, present := body["status"]; present {
		var v string
		if err := json.Unmarshal(raw, &v); err != nil || !slices.Contains(validStatuses, v) {
			badRequest(w, "Status must be one of: "+strings.Join(validStatuses, ", "))
			return
		}
		status = &v
	}

	if raw, present := body["contents"]; present {
		items, itemMsg, valid := parseContents(raw)
		if !valid {
			if itemMsg == "" {
				itemMsg = "Order contents must be a non-empty array"
			}
			badRequest(w, itemMsg)
			return
		}
		contents = items
	}

	updated, found := s.store.Update(id, sender, status, contents)
	if !found {
		writeError(w, http.StatusInternalServerError, "Internal server error", "Failed to update order")
		return
	}
	writeJSON(w, http.StatusOK, obj{"success": true, "data": updated, "message": "Order updated successfully"})
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Username any `json:"username"`
		Password any `json:"password"`
	}
	_ = json.NewDecoder(r.Body).Decode(&creds)

	for _, u := range users {
		if creds.Username == u.username && creds.Password == u.password {
			writeJSON(w, http.StatusOK, obj{"success": true, "token": hardcodedToken})
			return
		}
	}
	writeJSON(w, http.StatusUnauthorized, obj{"success": false, "error": "Invalid credentials"})
}

func (s *Server) protected(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, obj{
		"success": true,
		"message": "Access granted",
		"data": obj{
			"secretRecipes": []string{"Margherita Supreme", "Dragon Pepperoni", "Black Truffle Delight"},
			"staffDiscount": "50% off all pizzas",
			"vipCode":       "PIZZA-VIP-2024",
			"deliveryNote":  "Drivers use entrance B",
		},
	})
}

// decodeBase64 accepts padded or unpadded, standard or URL-safe base64.
func decodeBase64(s string) ([]byte, error) {
	s = strings.TrimRight(s, "=")
	if strings.ContainsAny(s, "-_") {
		return base64.RawURLEncoding.DecodeString(s)
	}
	return base64.RawStdEncoding.DecodeString(s)
}

func (s *Server) admin(w http.ResponseWriter, r *http.Request) {
	token, ok := extractBearerToken(r)
	if !ok || token == "" {
		writeError(w, http.StatusUnauthorized, "Unauthorized", "Token required")
		return
	}

	var payload any
	raw, err := decodeBase64(token)
	if err == nil {
		err = json.Unmarshal(raw, &payload)
	}
	if err != nil {
		writeError(w, http.StatusUnauthorized, "Unauthorized", "Invalid token format")
		return
	}

	if m, isObj := payload.(map[string]any); isObj && m["role"] == "admin" {
		writeJSON(w, http.StatusOK, obj{"success": true, "message": "Welcome, admin!"})
		return
	}
	writeError(w, http.StatusForbidden, "Forbidden", "Not authorised")
}
