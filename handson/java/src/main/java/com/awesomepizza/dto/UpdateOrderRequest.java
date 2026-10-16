package com.awesomepizza.dto;

import com.awesomepizza.model.OrderItem;

import java.util.List;

public class UpdateOrderRequest {

    private String sender;
    private String status;
    private List<OrderItem> contents;

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderItem> getContents() {
        return contents;
    }

    public void setContents(List<OrderItem> contents) {
        this.contents = contents;
    }
}
