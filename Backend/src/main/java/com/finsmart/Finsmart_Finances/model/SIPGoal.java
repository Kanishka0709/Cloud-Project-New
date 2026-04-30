package com.finsmart.Finsmart_Finances.model;

import java.time.LocalDate;


import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@DiscriminatorValue("SIPGoal")
public class SIPGoal extends InvestmentGoal{
	
	@NotNull(message = "You have to specify whether the Goal IS SIP or Not")
	@Column
	private Boolean isSIP;
	
	@NotNull(message = "The frequecy period can't be empty ")
	@Column
	private String sipFrequency; 
	
	
	@NotNull(message = "SIP Investment cannot be NULL")
	@Min(message = "Invested amount cannot be negative", value = 0)
	@Column
	private double sipamount;
	
	
	@NotNull(message = "Scheduled Investment cannot be negative")
	private LocalDate nextScheduledInvestment;


	public SIPGoal() {
	}


	public SIPGoal(Long id, String goalName, double targetAmount, LocalDate startDate, LocalDate endDate, String status,
			User user) {
		super(id, goalName, targetAmount, startDate, endDate, status, user);
		
	}


	public SIPGoal(@NotNull(message = "You have to specify whether the Goal IS SIP or Not") Boolean isSIP,
			@NotNull(message = "The frequecy period can't be empty ") String sipFrequency,
			@NotNull(message = "SIP Investment cannot be NULL") @Min(message = "Invested amount cannot be negative", value = 0) double sipamount,
			@NotNull(message = "Scheduled Investment cannot be negative") LocalDate nextScheduledInvestment) {
		super();
		this.isSIP = isSIP;
		this.sipFrequency = sipFrequency;
		this.sipamount = sipamount;
		this.nextScheduledInvestment = nextScheduledInvestment;
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


	public double getSipamount() {
		return sipamount;
	}


	public void setSipamount(double sipamount) {
		this.sipamount = sipamount;
	}


	public LocalDate getNextScheduledInvestment() {
		return nextScheduledInvestment;
	}


	public void setNextScheduledInvestment(LocalDate nextScheduledInvestment) {
		this.nextScheduledInvestment = nextScheduledInvestment;
	}
	
	
}
