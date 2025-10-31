package com.evelina.labs.controller;

import com.evelina.labs.exception.InvalidParameterException;
import com.evelina.labs.models.ErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.ZonedDateTime;
import java.util.stream.Collectors;
import java.util.List;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final View error;


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

        return ResponseEntity.status(HttpStatus.BAD_REQUEST) // <-- Возвращаем 400
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

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "NOT_FOUND", null,
                "Объект с ID " + ex.getMessage().split(" ")[3] + " не существует",
                ZonedDateTime.now().toString(),
                "/bands/"
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_XML)
                .body(errorResponse);
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

    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("*")
                    .allowedMethods("*");
        }
    }

}