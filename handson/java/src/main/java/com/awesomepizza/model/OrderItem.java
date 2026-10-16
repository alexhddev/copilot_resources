package com.awesomepizza.model;

public class OrderItem {

    private String name;
    private Integer quantity;

    public OrderItem() {
    }

    public OrderItem(String name, Integer quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
