package com.arc.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.ExpenseDTO;

public interface ExpenseService {

    ExpenseDTO addExpense(ExpenseDTO dto, MultipartFile proof);

    List<ExpenseDTO> getAllExpenses();

    void deleteExpense(Long id);
}
