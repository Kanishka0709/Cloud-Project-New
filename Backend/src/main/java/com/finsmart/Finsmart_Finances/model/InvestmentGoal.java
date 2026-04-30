package com.finsmart.Finsmart_Finances.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // or JOINED or TABLE_PER_CLASS
@DiscriminatorColumn(name = "dtype")
@Table(name = "investment_goals")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class InvestmentGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Goal for Investment cannot be Null ")
	@Column(name = "goal_name", nullable = false, length = 100)
	private String goalName;
	
    @Min(value = 500,message = "Atleast your minimum investment goal should be 500")
    @NotNull(message = "Target amount is required")
	@Column(name = "target_amount", nullable = false)
	private double targetAmount;
	
    @NotNull(message = "Starting date of your Investment is required")
	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;
	
    @NotNull(message = "Starting date of your Investment is required")
	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;
	
	@Column(length = 50)
	private String status; // e.g., "In Progress", "Completed"
	
	
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

    
	public InvestmentGoal() {
		
	}

	public InvestmentGoal(Long id, String goalName, double targetAmount, LocalDate startDate, LocalDate endDate,
			String status, User user) {
		
		this.id = id;
		this.goalName = goalName;
		this.targetAmount = targetAmount;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
		this.user = user;
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
    
	
    
    
}