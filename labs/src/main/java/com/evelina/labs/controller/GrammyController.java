package com.evelina.labs.controller;

import com.evelina.labs.models.MusicBand;
import com.evelina.labs.repository.MusicBandRepository;
import com.evelina.labs.service.MusicBandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/grammy")
public class GrammyController {
    private final MusicBandService musicBandService;
    public GrammyController(MusicBandService musicBandService) {
        this.musicBandService = musicBandService;
    }

    @PostMapping("/band/{band-id}/singles/add")
    public ResponseEntity<Void> addSingle(@PathVariable("band-id") Integer bandId) {
        musicBandService.addSingleToBand(bandId);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/band/{band-id}/participants/remove")
    public ResponseEntity<Void> removeParticipant(@PathVariable("band-id") Integer bandId) {
        musicBandService.removeParticipantFromBand(bandId);
        return ResponseEntity.ok().build();
    }
}
