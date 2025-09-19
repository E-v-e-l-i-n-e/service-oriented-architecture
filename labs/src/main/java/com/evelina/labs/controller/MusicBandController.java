package com.evelina.labs.controller;

import com.evelina.labs.models.MusicBand;
import com.evelina.labs.repository.MusicBandRepository;
import com.evelina.labs.service.MusicBandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("bands")
public class MusicBandController {

    private final MusicBandService musicBandService;

    public MusicBandController(MusicBandService musicBandService) {
        this.musicBandService = musicBandService;
    }

    @GetMapping
    public ResponseEntity<List<MusicBand>> getAllMusicBands() {
        List<MusicBand> allMusicBands =  musicBandService.getAllMusicBands();
        return ResponseEntity.ok(allMusicBands);
    }

    @PostMapping
    public ResponseEntity<MusicBand> createMusicBand(@RequestBody MusicBand musicBand) {
        MusicBand newMusicBand = musicBandService.createMusicBand(musicBand);
        return new ResponseEntity<>(newMusicBand, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MusicBand> getMusicBandById(@PathVariable Long id) {
        return musicBandService.getMusicBandById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMusicBandById(@PathVariable Long id) {
        musicBandService.deleteMusicBandById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count/by-singles")
    public ResponseEntity<Long> getAllMusicBandsBySinglesCount(@RequestParam long singlesCount) {
        Long musicBandsCount = musicBandService.getMusicBandsCountBySinglesCount(singlesCount);
        return ResponseEntity.ok(musicBandsCount);
    }

    @GetMapping("/count/greater-than-singles")
    public ResponseEntity<Long> getAllMusicBandsCountGreaterThan(@RequestParam long singlesCount) {
        return ResponseEntity.ok(
                musicBandService.getMusicBandsCountBySinglesCountGreaterThan(singlesCount)
        );
    }

    @GetMapping("/by-name-substring")
    public ResponseEntity<List<MusicBand>> getMusicBandsByNameSubstring(@RequestParam String nameSubstring) {
        List<MusicBand> musicBands = musicBandService.findByNameContaining(nameSubstring);
        return ResponseEntity.ok(musicBands);
    }
}
