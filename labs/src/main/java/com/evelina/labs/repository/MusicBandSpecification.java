package com.evelina.labs.repository;

import com.evelina.labs.dto.BandSearchRequest;
import com.evelina.labs.models.MusicBand;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;

public class MusicBandSpecification {

    public static Specification<MusicBand> searchByCriteria(BandSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(request.getName())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + request.getName().toLowerCase() + "%"
                ));
            }

            if (request.getGenre() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("genre"),
                        request.getGenre()
                ));
            }

            if (request.getNumberOfParticipants() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("numberOfParticipants"),
                        request.getNumberOfParticipants()
                ));
            }

            if (request.getSinglesCount() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("singlesCount"),
                        request.getSinglesCount()
                ));
            }

            if (request.getAlbumsCount() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("albumsCount"),
                        request.getAlbumsCount()
                ));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
