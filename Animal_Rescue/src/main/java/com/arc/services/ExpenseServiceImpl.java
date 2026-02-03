package com.arc.services;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.ExpenseDTO;
import com.arc.entities.Expense;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.exceptions.UnauthorizedActionException;
import com.arc.repositories.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final FileService fileService;
    private final ModelMapper modelMapper;

    // ================= HELPERS =================

    private boolean hasRole(String role) {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    // ================= SERVICES =================

    // ADMIN
    @Override
    public ExpenseDTO addExpense(
            ExpenseDTO dto,
            MultipartFile proof) {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException(
                    "Only admin can add expenses");
        }

        Expense expense = modelMapper.map(dto, Expense.class);
        expense.setExpenseDate(LocalDate.now());

        try {
            if (proof != null && !proof.isEmpty()) {
                expense.setExpenseProof(
                        fileService.saveFile(proof));
            }
        } catch (IOException e) {
            throw new RuntimeException(
                    "Expense proof upload failed");
        }

        Expense saved = expenseRepository.save(expense);
        return modelMapper.map(saved, ExpenseDTO.class);
    }

    // ADMIN
    @Override
    public List<ExpenseDTO> getAllExpenses() {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException(
                    "Only admin can view expenses");
        }

        return expenseRepository.findAll()
                .stream()
                .map(e -> modelMapper.map(e, ExpenseDTO.class))
                .toList();
    }

    // ADMIN
    @Override
    public void deleteExpense(Long id) {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException(
                    "Only admin can delete expense");
        }

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found"));

        expenseRepository.delete(expense);
    }
}
