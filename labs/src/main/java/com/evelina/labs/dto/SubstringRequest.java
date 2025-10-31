package com.evelina.labs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@XmlRootElement(name = "substring")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubstringRequest {
    @NotBlank(message = "Подстрока для поиска не может быть пустой")
    @XmlElement
    private String value;
}
