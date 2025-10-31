package com.evelina.grammy.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@XmlRootElement(name = "ErrorResponse")
@XmlAccessorType(XmlAccessType.FIELD)
public class ErrorResponse {
    @XmlElement
    private String error;

    @XmlElement
    private List<ValidationError> errors;

    @XmlElement
    private String message;

    @XmlElement
    private String timestamp;

    @XmlElement
    private String path;

    public ErrorResponse(String errorCode, String userMessage) {
        this.error = errorCode;
        this.message = userMessage;
        this.timestamp = ZonedDateTime.now().toString();
        this.errors = Collections.emptyList();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class ValidationError {
        @XmlElement
        private String field;

        @XmlElement
        private String message;
    }
}
