package com.finsmart.Finsmart_Finances.service;

import java.util.List;
import java.util.Optional;

import com.finsmart.Finsmart_Finances.dto.TaxProfileDTO;
import com.finsmart.Finsmart_Finances.model.TaxProfile;
import com.finsmart.Finsmart_Finances.model.User;

public interface TaxProfileService {
    TaxProfileDTO saveTaxProfile(TaxProfile taxProfile);
    List<TaxProfile> getAll();
    Optional<TaxProfile> getById(Long id);
    List<TaxProfileDTO> getByUserId(Long userId);
    void deleteTaxProfile(Long id);
    void deleteTaxProfileOfUser(Long userId);
    User findbyusername(String username);
}
