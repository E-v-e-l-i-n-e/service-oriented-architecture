package com.evelina.labs.models;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@XmlRootElement(name = "errorDesc")
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
        this.timestamp = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                .format(new java.util.Date());
        this.errors = null;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidationError {
        @XmlElement
        private String field;

        @XmlElement
        private String message;
    }
}