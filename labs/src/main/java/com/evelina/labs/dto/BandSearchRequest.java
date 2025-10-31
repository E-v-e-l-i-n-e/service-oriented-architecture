package com.evelina.labs.dto;

import com.evelina.labs.models.MusicGenre;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@XmlRootElement(name = "bandSearchRequest")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BandSearchRequest {

    @XmlElement(required = false)
    private String sort;

    @XmlElement(required = false)
    private String name;

    @XmlElement(required = false)
    private MusicGenre genre;

    @XmlElement(required = false)
    private Long numberOfParticipants;

    @XmlElement(required = false)
    private Long singlesCount;

    @XmlElement(required = false)
    private Integer albumsCount;
}
