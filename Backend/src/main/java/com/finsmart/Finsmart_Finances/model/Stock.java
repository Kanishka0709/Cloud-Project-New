package com.finsmart.Finsmart_Finances.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "stocks")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Stock {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Stock symbol is required")
    @Size(min = 1, max = 10, message = "Symbol must be between 1 to 10 characters")
    @Column(nullable = false, length = 10, unique = true)
    private String symbol; // e.g. INFY, TCS

    @PositiveOrZero(message = "Current price must be non-negative")
    @Column(nullable = false)
    private double currentPrice; // Can be updated via external API later

    @NotBlank(message = "Exchange is required")
    @Size(max = 10, message = "Exchange name can be at most 10 characters")
    @Column(nullable = false, length = 10)
    private String exchange; // NSE / BSE / NYSE etc.

    @Size(max = 50, message = "Sector name can be at most 50 characters")
    @Column(length = 50)
    private String sector; // IT, Pharma, etc.

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

 // IT, Pharma, etc. (Optional)
	public Stock() {
		
	}




	public Stock(Long id,
			@NotBlank(message = "Stock symbol is required") @Size(min = 1, max = 10, message = "Symbol must be between 1 to 10 characters") String symbol,
			@PositiveOrZero(message = "Current price must be non-negative") double currentPrice,
			@NotBlank(message = "Exchange is required") @Size(max = 10, message = "Exchange name can be at most 10 characters") String exchange,
			@Size(max = 50, message = "Sector name can be at most 50 characters") String sector
			) {
		super();
		this.id = id;
		this.symbol = symbol;
		this.currentPrice = currentPrice;
		this.exchange = exchange;
		this.sector = sector;
		
	}




	public Long getId() {
		return id;
	}




	public void setId(Long id) {
		this.id = id;
	}




	public String getSymbol() {
		return symbol;
	}




	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}




	public double getCurrentPrice() {
		return currentPrice;
	}




	public void setCurrentPrice(double currentPrice) {
		this.currentPrice = currentPrice;
	}




	public String getExchange() {
		return exchange;
	}




	public void setExchange(String exchange) {
		this.exchange = exchange;
	}




	public String getSector() {
		return sector;
	}




	public void setSector(String sector) {
		this.sector = sector;
	}

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
	
	

	
    
	
    
    
}
