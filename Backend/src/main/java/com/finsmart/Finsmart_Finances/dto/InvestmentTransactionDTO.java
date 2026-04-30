package com.finsmart.Finsmart_Finances.dto;

import java.time.LocalDateTime;

public class InvestmentTransactionDTO {
    private Long id;
    private Double amount;
    private String mode;
    private LocalDateTime dateTime;
    private String note;
    private String goalname;
    private Long goalId;

    public InvestmentTransactionDTO() {
        
    }

    public InvestmentTransactionDTO(Long id, Double amount, String mode, LocalDateTime dateTime, String note, String goalname, Long goalId) {
        this.id = id;
        this.amount = amount;
        this.mode = mode;
        this.dateTime = dateTime;
        this.note = note;
        this.goalname = goalname;
        this.goalId = goalId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getGoalname() {
        return goalname;
    }

    public void setGoalname(String goalname) {
        this.goalname = goalname;
    }

    public Long getGoalId() {
        return goalId;
    }

    public void setGoalId(Long goalId) {
        this.goalId = goalId;
    }
}
