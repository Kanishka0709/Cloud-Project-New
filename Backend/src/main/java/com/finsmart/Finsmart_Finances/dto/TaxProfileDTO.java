package com.finsmart.Finsmart_Finances.dto;

public class TaxProfileDTO {
    private Long id;
    private Double annualIncome;
    private Double deductions;
    private String employer;
    private String filingStatus;
    private String financialYear;
    private String panNumber;
    private Double taxPaid;
    private Long userId;

    public TaxProfileDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(Double annualIncome) { this.annualIncome = annualIncome; }

    public Double getDeductions() { return deductions; }
    public void setDeductions(Double deductions) { this.deductions = deductions; }

    public String getEmployer() { return employer; }
    public void setEmployer(String employer) { this.employer = employer; }

    public String getFilingStatus() { return filingStatus; }
    public void setFilingStatus(String filingStatus) { this.filingStatus = filingStatus; }

    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public Double getTaxPaid() { return taxPaid; }
    public void setTaxPaid(Double taxPaid) { this.taxPaid = taxPaid; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
} 