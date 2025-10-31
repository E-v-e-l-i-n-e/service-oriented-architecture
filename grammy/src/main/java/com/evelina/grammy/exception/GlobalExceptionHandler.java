package com.evelina.grammy.exception;


import com.evelina.grammy.dto.ErrorResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.View;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(MethodArgumentNotValidException ex) {
        String error = "BAD_REQUEST";
        List<ErrorResponse.ValidationError> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> new ErrorResponse.ValidationError(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()
                ))
                .collect(Collectors.toList());
        ErrorResponse errorResponse = new ErrorResponse(
                error,
                errors,"Произошла ошибка валидации",
                ZonedDateTime.now().toString(),
                "/bands"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_XML)
                .body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String paramName = ex.getName();
        String paramValue = ex.getValue().toString();

        ErrorResponse errorResponse = new ErrorResponse(
                "BAD_REQUEST", null,
                "Некорректное значение параметра " + paramName + ": " + paramValue,
                ZonedDateTime.now().toString(),
                "/bands/" + paramValue
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_XML)
                .body(errorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        ConstraintViolation<?> violation = ex.getConstraintViolations().iterator().next();
        String paramName = violation.getPropertyPath().toString();
        paramName = paramName.substring(paramName.lastIndexOf('.') + 1);
        String paramValue = violation.getInvalidValue() != null ? violation.getInvalidValue().toString() : "null";
        ErrorResponse errorResponse = new ErrorResponse(
                "BAD_REQUEST",
                null,
                "Некорректное значение параметра " + paramName + ": " + paramValue,
                ZonedDateTime.now().toString(),
                "/bands/" + paramValue
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_XML)
                .body(errorResponse);
    }
    private ErrorResponse createErrorResponse(String code, String message) {
        return new ErrorResponse(code, message);
    }

    @ExceptionHandler(InvalidParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleInvalidParameterException(InvalidParameterException ex) {
        ErrorResponse error = createErrorResponse("BAD_REQUEST", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_XML)
                .body(error);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex) {
        ErrorResponse error = new ErrorResponse(
                "UNSUPPORTED_MEDIA_TYPE", null,
                "Тело запроса должно быть в формате XML",
                ZonedDateTime.now().toString(),
                "/bands"
        );
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .contentType(MediaType.APPLICATION_XML)
                .body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleUnprocessableEntity(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(
                "UNPROCESSABLE_ENTITY", null,
                ex.getMessage() != null ? ex.getMessage() : "Неверный формат тела запроса",
                ZonedDateTime.now().toString(),
                "/bands"
        );
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .contentType(MediaType.APPLICATION_XML)
                .body(error);
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleInternalServerError(Exception ex) {
        ErrorResponse error = new ErrorResponse(
                "INTERNAL_SERVER_ERROR", null,
                "Произошла непредвиденная ошибка сервера",
                ZonedDateTime.now().toString(),
                "/bands"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_XML)
                .body(error);
    }

    @ExceptionHandler(ServiceCallException.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleServiceCallException(ServiceCallException ex) {
        HttpStatusCode status = ex.getStatusCode();
        String errorCode = status.toString().replace(" ", "_");
        ErrorResponse error = createErrorResponse(errorCode, ex.getMessage());

        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_XML)
                .body(error);
    }
}
