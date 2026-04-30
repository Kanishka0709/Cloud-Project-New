package com.finsmart.Finsmart_Finances.dto;

import java.time.LocalDate;

public class StockTransactionDTO {
	private int quantity;
    private double purchasePrice;
    private LocalDate transactionDate;
    private String transactionType;
    private double currentPrice;
    private String symbol; // which we'll fetch from Stocks table
    private Long id;
    
	public StockTransactionDTO() {
		
	}

	public StockTransactionDTO(int quantity, double purchasePrice, LocalDate transactionDate, String transactionType,
			double currentPrice, String symbol) {
		super();
		this.quantity = quantity;
		this.purchasePrice = purchasePrice;
		this.transactionDate = transactionDate;
		this.transactionType = transactionType;
		this.currentPrice = currentPrice;
		this.symbol = symbol;
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

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
	
	
    

}
