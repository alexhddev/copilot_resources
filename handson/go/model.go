package main

type MenuEntry struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ImageURL    string `json:"imageUrl"`
}

type OrderItem struct {
	Name     string  `json:"name"`
	Quantity float64 `json:"quantity"`
}

type Order struct {
	ID       string      `json:"id"`
	Sender   string      `json:"sender"`
	Status   string      `json:"status"`
	Contents []OrderItem `json:"contents"`
}

var validStatuses = []string{"RECEIVED", "DELIVERING", "DELIVERED", "CANCELED"}
