package com.finsmart.Finsmart_Finances.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "investment_transactions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class InvestmentTransaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Min(value = 1, message = "Amount must be greater than 0")
	@NotNull(message = "Amount is required")
	@Column(nullable = false)
	private Double amount;

	@NotBlank(message = "Mode of investment is required")
	@Size(min = 3, max = 50, message = "Mode should be between 3 to 50 characters")
	@Column(nullable = false, length = 50)
	private String mode; // e.g. "SIP", "Lump Sum", "Auto-Debit"

	@NotNull(message = "Transaction datetime is required")
	@Column(nullable = false)
	private LocalDateTime dateTime = LocalDateTime.now();

	@Size(max = 255, message = "Note should not exceed 255 characters")
	@Column(length = 255)
	private String note;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "goal_id", nullable = false)
	@NotNull(message = "Associated investment goal is required")
	private InvestmentGoal goal;

	// Constructors, getters, setters (if not using Lombok)

	public InvestmentTransaction() {
		
	}

	public InvestmentTransaction(Long id, double amount, String mode, LocalDateTime dateTime, String note,
			InvestmentGoal goal) {
		super();
		this.id = id;
		this.amount = amount;
		this.mode = mode;
		this.dateTime = dateTime;
		this.note = note;
		this.goal = goal;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
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

	public InvestmentGoal getGoal() {
		return goal;
	}

	public void setGoal(InvestmentGoal goal) {
		this.goal = goal;
	}
    
    

}
