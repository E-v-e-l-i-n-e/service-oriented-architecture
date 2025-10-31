package com.evelina.labs.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@XmlType(propOrder = {"sales"})
public class Label {
    @Min(value = 1, message = "Продажи не могут быть меньше 1")
    @XmlElement
    private long sales; //Значение поля должно быть больше 0
}