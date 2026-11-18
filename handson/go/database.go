package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

var dailyMenu = []MenuEntry{
	{
		Name:        "Margherita Pizza",
		Description: "Classic pizza with fresh tomatoes, mozzarella cheese, and basil",
		ImageURL:    "assets/origs/margherita.png",
	},
	{
		Name:        "Pepperoni Pizza",
		Description: "Traditional pizza topped with pepperoni and mozzarella cheese",
		ImageURL:    "assets/origs/pepperoni.png",
	},
	{
		Name:        "Quattro Stagioni",
		Description: "Four seasons pizza with artichokes, ham, mushrooms, and olives",
		ImageURL:    "assets/origs/quattro.png",
	},
	{
		Name:        "Vegetarian Delight",
		Description: "Fresh vegetables including bell peppers, onions, mushrooms, and tomatoes",
		ImageURL:    "assets/origs/vegetarian.png",
	},
	{
		Name:        "BBQ Chicken Pizza",
		Description: "Grilled chicken with BBQ sauce, red onions, and cilantro",
		ImageURL:    "assets/origs/bbq-chicken.png",
	},
}

// OrderStore is a concurrency-safe in-memory order database.
type OrderStore struct {
	mu     sync.RWMutex
	orders []Order
}

func NewOrderStore() *OrderStore {
	return &OrderStore{orders: []Order{
		{
			ID:     "order-001",
			Sender: "John Doe",
			Status: "RECEIVED",
			Contents: []OrderItem{
				{Name: "Margherita Pizza", Quantity: 2},
				{Name: "Pepperoni Pizza", Quantity: 1},
			},
		},
		{
			ID:     "order-002",
			Sender: "Jane Smith",
			Status: "DELIVERING",
			Contents: []OrderItem{
				{Name: "Vegetarian Delight", Quantity: 1},
				{Name: "BBQ Chicken Pizza", Quantity: 1},
			},
		},
		{
			ID:     "order-003",
			Sender: "Mike Johnson",
			Status: "DELIVERED",
			Contents: []OrderItem{
				{Name: "Quattro Stagioni", Quantity: 3},
			},
		},
	}}
}

func generateOrderID() string {
	return fmt.Sprintf("order-%d-%d", time.Now().UnixMilli(), rand.Intn(1000))
}

func (s *OrderStore) FindByID(id string) (Order, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, o := range s.orders {
		if o.ID == id {
			return o, true
		}
	}
	return Order{}, false
}

func (s *OrderStore) Add(sender string, contents []OrderItem) Order {
	s.mu.Lock()
	defer s.mu.Unlock()
	o := Order{ID: generateOrderID(), Sender: sender, Status: "RECEIVED", Contents: contents}
	s.orders = append(s.orders, o)
	return o
}

// Update applies the non-nil fields to the order with the given ID.
func (s *OrderStore) Update(id string, sender, status *string, contents []OrderItem) (Order, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.orders {
		if s.orders[i].ID != id {
			continue
		}
		if sender != nil {
			s.orders[i].Sender = *sender
		}
		if status != nil {
			s.orders[i].Status = *status
		}
		if contents != nil {
			s.orders[i].Contents = contents
		}
		return s.orders[i], true
	}
	return Order{}, false
}
