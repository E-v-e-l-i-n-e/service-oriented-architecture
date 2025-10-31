package com.evelina.labs.repository;

import com.evelina.labs.models.MusicBand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicBandRepository extends JpaRepository<MusicBand, Integer>, JpaSpecificationExecutor<MusicBand>     {

    MusicBand getMusicBandById(Integer id);
    Long countBySinglesCount(Long singlesCount);
    Long countBySinglesCountGreaterThan(Long singlesCount);
    Page<MusicBand> findByNameContaining(String nameSubstring, Pageable pageable);
}
