package com.evelina.labs.service;

import com.evelina.labs.models.MusicBand;
import com.evelina.labs.models.MusicGenre;
import com.evelina.labs.repository.MusicBandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MusicBandService {

    private final MusicBandRepository musicBandRepository;

    public MusicBandService(MusicBandRepository musicBandRepository) {
        this.musicBandRepository = musicBandRepository;
    }

    public MusicBand createMusicBand(MusicBand musicBand) {
        return musicBandRepository.save(musicBand);
    }

    public List<MusicBand> getAllMusicBands() {
        return musicBandRepository.findAll();
    }

    public Optional<MusicBand> getMusicBandById(Long id) {
        return musicBandRepository.findById(id);
    }

    public void deleteMusicBandById(Long id) {
        musicBandRepository.deleteById(id);
    }

    public Long getMusicBandsCountBySinglesCount(long singlesCount) {
        return musicBandRepository.countBySinglesCount(singlesCount);
    }

    public Long getMusicBandsCountBySinglesCountGreaterThan(long singlesCount) {
        return musicBandRepository.countBySinglesCountGreaterThan(singlesCount);
    }

    public List<MusicBand> findByNameContaining(String nameSubstring) {
        return musicBandRepository.findByNameContaining(nameSubstring);
    }
}
