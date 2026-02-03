package com.arc.exceptions;

public class DuplicateAdoptionException extends RuntimeException {
    public DuplicateAdoptionException(String message) {
        super(message);
    }
}
