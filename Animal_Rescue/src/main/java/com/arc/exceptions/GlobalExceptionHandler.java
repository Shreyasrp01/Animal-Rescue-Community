package com.arc.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.arc.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    

    @ExceptionHandler(DuplicateAdoptionException.class)
    public ResponseEntity<ApiResponse> handleDuplicateAdoption(
            DuplicateAdoptionException e) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409
                .body(new ApiResponse("Failed", e.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFoundException(
            ResourceNotFoundException e) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse("Failed", e.getMessage()));
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleResourceAlreadyExistsException(
            ResourceAlreadyExistsException e) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiResponse("Failed", e.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse> handleBadRequestException(
            BadRequestException e) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse("Failed", e.getMessage()));
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ApiResponse> handleUnauthorizedActionException(
            UnauthorizedActionException e) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse("Failed", e.getMessage()));
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<ApiResponse> handleLoginException(
            LoginException e) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse("Failed", e.getMessage()));
    }

    /* ================= VALIDATION ================= */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationException(
            MethodArgumentNotValidException e) {

        String errorMsg = e.getBindingResult()
                .getFieldError()
                .getDefaultMessage();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse("Failed", errorMsg));
    }

    /* ================= FALLBACK (LAST ONLY) ================= */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleException(Exception e) {

        e.printStackTrace(); // log only real bugs

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed", "Something went wrong"));
    }
}
