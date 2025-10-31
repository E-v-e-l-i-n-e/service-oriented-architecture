package com.evelina.grammy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatusCode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoidResponse {

    HttpStatusCode statusCode;
    ErrorResponse error;
}
