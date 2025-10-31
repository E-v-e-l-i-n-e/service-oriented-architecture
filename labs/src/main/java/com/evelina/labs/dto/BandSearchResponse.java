package com.evelina.labs.dto;

import com.evelina.labs.models.MusicBand;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlElementWrapper;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@XmlRootElement(name = "response")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class BandSearchResponse extends PaginationBase {
    @XmlElementWrapper(name = "bands")
    @XmlElement(name = "band")
    private List<MusicBand> bands;
}