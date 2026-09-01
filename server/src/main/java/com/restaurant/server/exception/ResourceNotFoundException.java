package com.restaurant.server.exception;

// Thrown when a lookup (table token, order id, menu item id, etc.) fails.
// A future @ControllerAdvice can catch this and map it to a 404 response.
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}