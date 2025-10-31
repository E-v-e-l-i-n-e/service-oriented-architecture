package com.evelina.grammy.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@XmlRootElement(name = "count")
@Data
public class CountResponse {
    @XmlElement(name = "value")
    private Long value;
}