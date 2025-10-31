package com.evelina.labs.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@XmlRootElement(name = "count")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CountResponse {
    @XmlElement(name = "value")
    private Long value;
}
