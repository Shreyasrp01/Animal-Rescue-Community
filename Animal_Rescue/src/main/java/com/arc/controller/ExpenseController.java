package com.arc.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.ApiResponse;
import com.arc.dto.ExpenseDTO;
import com.arc.services.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final ObjectMapper objectMapper;

    // ADD EXPENSE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addExpense(
            @RequestPart("expense") String expenseJson,
            @RequestPart(value = "proof", required = false)
                    MultipartFile proof
    ) throws Exception {

        ExpenseDTO dto =
                objectMapper.readValue(expenseJson, ExpenseDTO.class);

        expenseService.addExpense(dto, proof);

        return ResponseEntity.ok(
                new ApiResponse(
                        "Expense added successfully",
                        "SUCCESS")
        );
    }

    // VIEW ALL
    @GetMapping
    public ResponseEntity<?> getAllExpenses() {
        return ResponseEntity.ok(
                expenseService.getAllExpenses());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.ok(
                new ApiResponse(
                        "Expense deleted successfully",
                        "SUCCESS")
        );
    }
}
