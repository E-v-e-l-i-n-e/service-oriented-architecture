package com.evelina.grammy.controller;

import com.evelina.grammy.service.GrammyClientService;
import com.evelina.grammy.dto.ErrorResponse;
import com.evelina.grammy.dto.VoidResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/grammy")
@RequiredArgsConstructor
public class GrammyController {

    private final GrammyClientService grammyClientService;

    @DeleteMapping(value="/band/{band-id}/participants/remove", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<ErrorResponse> removeParticipant(@PathVariable("band-id") Integer bandId) {
        VoidResponse response = grammyClientService.removeParticipantFromBand(bandId);
        return ResponseEntity.status(response.getStatusCode()).body(response.getError());
    }

    @PostMapping(value = "/band/{band-id}/singles/add", produces =  MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<ErrorResponse> addSingle(@PathVariable("band-id") Integer bandId) {
        VoidResponse response = grammyClientService.addSingleToBand(bandId);
        return ResponseEntity.status(response.getStatusCode()).body(response.getError());
    }
}
