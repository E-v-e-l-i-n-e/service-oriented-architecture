package com.evelina.labs.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Coordinates {
    @Column(nullable = false)
    private Integer x; //Поле не может быть null

    private long y;
}