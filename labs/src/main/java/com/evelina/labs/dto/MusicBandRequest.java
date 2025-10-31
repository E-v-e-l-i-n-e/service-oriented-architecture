package com.evelina.labs.dto;

import com.evelina.labs.models.Coordinates;
import com.evelina.labs.models.Label;
import com.evelina.labs.models.MusicGenre;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@XmlRootElement(name = "bandRequest")
@AllArgsConstructor
@NoArgsConstructor
public class MusicBandRequest {
    @NotBlank(message = "Имя не может быть пустым")
    @XmlElement
    private String name;

    @NotNull(message = "Координаты не могут быть пустыми")
    @XmlElement
    private Coordinates coordinates;

    @NotNull(message = "Количество участников не может быть пустым")
    @Min(value = 1, message = "Количество участников не может быть меньше 1")
    @XmlElement
    private Long numberOfParticipants;

    @Min(value = 1, message = "Количество синглов не может быть меньше 1")
    @XmlElement
    private Long singlesCount;

    @Min(value = 1, message = "Количество альбомов не может быть меньше 1")
    @XmlElement
    private Integer albumsCount;

    @NotNull(message = "Музыкальный жанр не может быть пустым")
    @XmlElement(name = "musicGenre")
    private MusicGenre musicGenre;

    @NotNull(message = "Лейбл не может быть пустым")
    @XmlElement
    private Label label;
}
