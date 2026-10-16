package com.awesomepizza.model;

import java.util.List;

public class Order {

    private final String id;
    private String sender;
    private OrderStatus status;
    private List<OrderItem> contents;

    public Order(String id, String sender, OrderStatus status, List<OrderItem> contents) {
        this.id = id;
        this.sender = sender;
        this.status = status;
        this.contents = contents;
    }

    public String getId() {
        return id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public List<OrderItem> getContents() {
        return contents;
    }

    public void setContents(List<OrderItem> contents) {
        this.contents = contents;
    }
}
