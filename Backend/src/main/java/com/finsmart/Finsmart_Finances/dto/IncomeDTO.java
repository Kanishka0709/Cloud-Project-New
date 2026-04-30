package com.finsmart.Finsmart_Finances.dto;

public class IncomeDTO {
    private Long id;
    private double amount;
    private Long userId;

    public IncomeDTO() {}

    public IncomeDTO(Long id, double amount, Long userId) {
        this.id = id;
        this.amount = amount;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
} 