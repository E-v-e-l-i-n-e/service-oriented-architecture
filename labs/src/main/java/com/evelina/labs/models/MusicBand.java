package com.evelina.labs.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Table(name="music_band")
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class MusicBand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; //Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически

    @Column(nullable = false)
    @NotBlank
    private String name; //Поле не может быть null, Строка не может быть пустой

    @Embedded
    private Coordinates coordinates; //Поле не может быть null

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private java.time.LocalDateTime creationDate; //Поле не может быть null, Значение этого поля должно генерироваться автоматически

    @Column(nullable = false)
    @Min(value = 1)
    private Long numberOfParticipants; //Поле не может быть null, Значение поля должно быть больше 0

    @Min(value = 1)
    private long singlesCount; //Значение поля должно быть больше 0

    @Min(value = 1)
    private int albumsCount; //Значение поля должно быть больше 0

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MusicGenre genre; //Поле не может быть null

    @Embedded
    private Label label; //Поле может быть null
}