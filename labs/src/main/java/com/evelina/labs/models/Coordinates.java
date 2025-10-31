package com.evelina.labs.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@XmlType(propOrder = {"x", "y"})
public class Coordinates {
    @Column(nullable = false)
    @NotNull(message = "Координата X не может быть пустой")
    @XmlElement
    private Integer x; //Поле не может быть null

    @XmlElement
    private long y;
}