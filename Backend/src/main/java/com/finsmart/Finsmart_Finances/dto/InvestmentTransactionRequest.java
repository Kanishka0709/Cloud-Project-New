package com.finsmart.Finsmart_Finances.dto;

public class InvestmentTransactionRequest {
    private Double amount;
    private String mode;
    private String dateTime;
    private String note;
    private Long goalId;

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public Long getGoalId() { return goalId; }
    public void setGoalId(Long goalId) { this.goalId = goalId; }
} 