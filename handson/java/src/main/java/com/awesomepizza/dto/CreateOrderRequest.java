package com.awesomepizza.dto;

import com.awesomepizza.model.OrderItem;

import java.util.List;

public class CreateOrderRequest {

    private String sender;
    private List<OrderItem> contents;

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public List<OrderItem> getContents() {
        return contents;
    }

    public void setContents(List<OrderItem> contents) {
        this.contents = contents;
    }
}
