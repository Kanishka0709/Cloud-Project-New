package com.finsmart.Finsmart_Finances.model;



import java.time.LocalDate;

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
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "stock_transactions")

public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private int quantity;

    @Positive(message = "Purchase price must be positive")
    @Column(nullable = false)
    private double purchasePrice;

    @NotNull(message = "Transaction date is required")
    @Column(nullable = false)
    private LocalDate transactionDate;

    @NotBlank(message = "Transaction type is required")
    @Pattern(regexp = "BUY|SELL", message = "Transaction type must be BUY or SELL")
    @Column(nullable = false, length = 10)
    private String transactionType; // BUY or SELL

    // Optionally show snapshot of current price at time of transaction
    @PositiveOrZero(message = "Current price must be non-negative")
    private double currentPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

	public StockTransaction() {
		
	}

	public StockTransaction(Long id, @Min(value = 1, message = "Quantity must be at least 1") int quantity,
			@Positive(message = "Purchase price must be positive") double purchasePrice,
			@NotNull(message = "Transaction date is required") LocalDate transactionDate,
			@NotBlank(message = "Transaction type is required") @Pattern(regexp = "BUY|SELL", message = "Transaction type must be BUY or SELL") String transactionType,
			@PositiveOrZero(message = "Current price must be non-negative") double currentPrice, Stock stock,
			User user) {
		super();
		this.id = id;
		this.quantity = quantity;
		this.purchasePrice = purchasePrice;
		this.transactionDate = transactionDate;
		this.transactionType = transactionType;
		this.currentPrice = currentPrice;
		this.stock = stock;
		this.user = user;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getPurchasePrice() {
		return purchasePrice;
	}

	public void setPurchasePrice(double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	public LocalDate getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(LocalDate transactionDate) {
		this.transactionDate = transactionDate;
	}

	public String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}

	public double getCurrentPrice() {
		return currentPrice;
	}

	public void setCurrentPrice(double currentPrice) {
		this.currentPrice = currentPrice;
	}

	public Stock getStock() {
		return stock;
	}

	public void setStock(Stock stock) {
		this.stock = stock;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
    
	
    
    
    
}
