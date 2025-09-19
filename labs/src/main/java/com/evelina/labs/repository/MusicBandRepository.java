package com.evelina.labs.repository;

import com.evelina.labs.models.MusicBand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicBandRepository extends JpaRepository<MusicBand, Long> {

    public Long countBySinglesCount(long singlesCount);
    Long countBySinglesCountGreaterThan(long singlesCount);
    public List<MusicBand> findByNameContaining(String nameSubstring);
}
