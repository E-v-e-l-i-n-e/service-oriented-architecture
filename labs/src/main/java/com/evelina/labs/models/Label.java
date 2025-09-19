package com.evelina.labs.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Label {
    @Min(value = 1)
    private long sales; //Значение поля должно быть больше 0
}