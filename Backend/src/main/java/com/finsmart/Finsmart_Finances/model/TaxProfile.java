package com.finsmart.Finsmart_Finances.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tax_profiles")



public class TaxProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "PAN number is required")
	@Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]", message = "Invalid PAN number format")
	@Column(name = "pan_number", nullable = false, unique = true, length = 10)
	private String panNumber;

	@PositiveOrZero(message = "Annual income must be non-negative")
	@Column(name = "annual_income", nullable = false)
	private double annualIncome;

	@PositiveOrZero(message = "Deductions must be non-negative")
	@Column(nullable = false)
	private double deductions; // 80C, 80D etc.

	@PositiveOrZero(message = "Tax paid must be non-negative")
	@Column(name = "tax_paid", nullable = false)
	private double taxPaid;

	@Pattern(regexp = "^[0-9]{2}-[0-9]{2}$|^[0-9]{4}-[0-9]{4}$", message = "Financial year must be in format '25-26' or '2024-2025'")
	@Column(name = "financial_year", nullable = false)
	private String financialYear; // e.g., 2024 for FY 2024-25

	@NotBlank(message = "Filing status is required")
	@Pattern(regexp = "PENDING|FILED|REVIEW", message = "Filing status must be PENDING, FILED, or REVIEW")
	@Column(name = "filing_status", nullable = false, length = 10)
	private String filingStatus;

	@Size(max = 100, message = "Employer name can be up to 100 characters")
	private String employer; // Optional

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	// Add constructors, getters, setters (or use Lombok @Data, etc.)


	public TaxProfile() {
		
	}

	public TaxProfile(Long id, String panNumber, double annualIncome, double deductions, double taxPaid,
			String financialYear, String filingStatus, String employer, User user) {
		super();
		this.id = id;
		this.panNumber = panNumber;
		this.annualIncome = annualIncome;
		this.deductions = deductions;
		this.taxPaid = taxPaid;
		this.financialYear = financialYear;
		this.filingStatus = filingStatus;
		this.employer = employer;
		this.user = user;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPanNumber() {
		return panNumber;
	}

	public void setPanNumber(String panNumber) {
		this.panNumber = panNumber;
	}

	public double getAnnualIncome() {
		return annualIncome;
	}

	public void setAnnualIncome(double annualIncome) {
		this.annualIncome = annualIncome;
	}

	public double getDeductions() {
		return deductions;
	}

	public void setDeductions(double deductions) {
		this.deductions = deductions;
	}

	public double getTaxPaid() {
		return taxPaid;
	}

	public void setTaxPaid(double taxPaid) {
		this.taxPaid = taxPaid;
	}

	public String getFinancialYear() {
		return financialYear;
	}

	public void setFinancialYear(String financialYear) {
		this.financialYear = financialYear;
	}

	public String getFilingStatus() {
		return filingStatus;
	}

	public void setFilingStatus(String filingStatus) {
		this.filingStatus = filingStatus;
	}

	public String getEmployer() {
		return employer;
	}

	public void setEmployer(String employer) {
		this.employer = employer;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
    
    
}
