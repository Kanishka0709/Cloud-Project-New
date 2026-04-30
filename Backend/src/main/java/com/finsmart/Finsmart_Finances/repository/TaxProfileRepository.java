package com.finsmart.Finsmart_Finances.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finsmart.Finsmart_Finances.model.TaxProfile;

public interface TaxProfileRepository extends JpaRepository<TaxProfile, Long> {
    List<TaxProfile> findByUserId(Long userId);
}
