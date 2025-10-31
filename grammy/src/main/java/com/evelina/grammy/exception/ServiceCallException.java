package com.evelina.grammy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class ServiceCallException extends RuntimeException {

    private final HttpStatusCode statusCode;

    public ServiceCallException(String message, HttpStatusCode statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public HttpStatusCode getStatusCode() {
        return statusCode;
    }
}