package com.evelina.labs.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@XmlRootElement(name = "pagination")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pagination {
    @XmlElement
    private Integer page;

    @XmlElement
    private Integer totalPages;

    @XmlElement
    private Long totalCount;

    @XmlElement
    private Integer size;
}