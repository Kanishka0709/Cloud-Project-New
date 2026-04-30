package com.finsmart.Finsmart_Finances.dto;

import java.time.LocalDate;

public class InvestmentGoalDTO {
    private Long id;
    private String goalName;
    private double targetAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Boolean isSIP;
    private String sipFrequency;
    private double sipAmount;
    private LocalDate nextScheduledInvestment;
    
    public InvestmentGoalDTO() {
        
    }

    public InvestmentGoalDTO(Long id, String goalName, double targetAmount, LocalDate startDate, LocalDate endDate,
            String status) {
        this.id = id;
        this.goalName = goalName;
        this.targetAmount = targetAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGoalName() {
        return goalName;
    }

    public void setGoalName(String goalName) {
        this.goalName = goalName;
    }

    public double getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsSIP() {
        return isSIP;
    }

    public void setIsSIP(Boolean isSIP) {
        this.isSIP = isSIP;
    }

    public String getSipFrequency() {
        return sipFrequency;
    }

    public void setSipFrequency(String sipFrequency) {
        this.sipFrequency = sipFrequency;
    }

    public double getSipAmount() {
        return sipAmount;
    }

    public void setSipAmount(double sipAmount) {
        this.sipAmount = sipAmount;
    }

    public LocalDate getNextScheduledInvestment() {
        return nextScheduledInvestment;
    }

    public void setNextScheduledInvestment(LocalDate nextScheduledInvestment) {
        this.nextScheduledInvestment = nextScheduledInvestment;
    }
}
