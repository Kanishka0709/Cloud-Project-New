package com.finsmart.Finsmart_Finances.model;

import java.time.LocalDate;
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
@Table(name = "expenses")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // use this due to Lazy loader thing
															  // which tries to Serialize the things when needed

public class Expense {

   

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


	@Min(value = 1, message = "Minimum Expense should be 1Rs")
	@Column(nullable = false)
	private double amount;

	@NotBlank(message = "Category is required")
	@Size(min = 3, max = 50, message = "Category should be between 3–50 characters")
	@Column(nullable = false, length = 50)
	private String category;

	@Column(length = 255)
	private String description;

	@NotNull(message = "Date of expenditure is required")
	@Column(nullable = false)
	private LocalDate expenseDate;

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
    
    
    
    public Expense() {
		
	}



	public Expense(Long id, double amount, String category, String description, LocalDate expenseDate,
			LocalDateTime createdAt, User user) {
		super();
		this.id = id;
		this.amount = amount;
		this.category = category;
		this.description = description;
		this.expenseDate = expenseDate;
		this.createdAt = createdAt;
		this.user = user;
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



	public String getCategory() {
		return category;
	}



	public void setCategory(String category) {
		this.category = category;
	}



	public String getDescription() {
		return description;
	}



	public void setDescription(String description) {
		this.description = description;
	}



	public LocalDate getExpenseDate() {
		return expenseDate;
	}



	public void setExpenseDate(LocalDate expenseDate) {
		this.expenseDate = expenseDate;
	}



	public LocalDateTime getCreatedAt() {
		return createdAt;
	}



	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}



	public User getUser() {
		return user;
	}



	public void setUser(User user) {
		this.user = user;
	}
    
    
}
