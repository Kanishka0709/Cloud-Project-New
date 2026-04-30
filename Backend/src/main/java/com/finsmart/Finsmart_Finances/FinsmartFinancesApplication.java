package com.finsmart.Finsmart_Finances;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@EnableScheduling
@SpringBootApplication
public class FinsmartFinancesApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinsmartFinancesApplication.class, args);
	}

}
