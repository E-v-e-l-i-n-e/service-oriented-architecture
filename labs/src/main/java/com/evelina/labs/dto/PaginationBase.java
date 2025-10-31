package com.evelina.labs.dto;

import jakarta.xml.bind.annotation.XmlElement;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaginationBase {

    @XmlElement(name = "pagination")
    private Pagination pagination;

    public void setPage(Integer page) {
        if (this.pagination == null) this.pagination = new Pagination();
        this.pagination.setPage(page);
    }

    public void setTotalPages(Integer totalPages) {
        if (this.pagination == null) this.pagination = new Pagination();
        this.pagination.setTotalPages(totalPages);
    }

    public void setTotalCount(Long totalCount) {
        if (this.pagination == null) this.pagination = new Pagination();
        this.pagination.setTotalCount(totalCount);
    }

    public void setSize(Integer size) {
        if (this.pagination == null) this.pagination = new Pagination();
        this.pagination.setSize(size);
    }
}