package com.evelina.labs.controller;

import com.evelina.labs.dto.*;
import com.evelina.labs.exception.InvalidParameterException;
import com.evelina.labs.models.MusicBand;
import com.evelina.labs.repository.MusicBandRepository;
import com.evelina.labs.service.MusicBandService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import java.util.Arrays;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Validated
@RequestMapping(path = "/bands", produces = MediaType.APPLICATION_XML_VALUE)
public class MusicBandController {

    private final MusicBandService musicBandService;

    public MusicBandController(MusicBandService musicBandService) {
        this.musicBandService = musicBandService;
    }

    private Sort parseSort(String sortString) {
        if (sortString == null || sortString.isEmpty()) {
            return Sort.unsorted();
        }
        try {
            String[] parts = sortString.split(";")[0].split(",");
            String field = parts[0];
            if (!Arrays.asList("id", "name", "creationDate", "numberOfParticipants", "singlesCount", "albumsCount").contains(field)) {
                throw new InvalidParameterException("Поле для сортировки '" + field + "' недопустимо.");
            }

            Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            return Sort.by(direction, field);
        } catch (InvalidParameterException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidParameterException("Некорректный формат параметра sort: " + sortString);
        }
    }

    @PostMapping(path = "/filters", produces = MediaType.APPLICATION_XML_VALUE, consumes = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<BandSearchResponse> getMusicBandsWithFilters(
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(required = false) String sort,
            @Valid @RequestBody(required = false)BandSearchRequest bandSearchRequest
            ) {
        Sort sortObject = parseSort(sort);

        PageRequest pageable = PageRequest.of(page - 1, size, sortObject);
        BandSearchRequest request = (bandSearchRequest != null) ? bandSearchRequest : new BandSearchRequest();
        Page<MusicBand> bandPage = musicBandService.getBandsWithFilterAndPagination(request, pageable);

        BandSearchResponse response = new BandSearchResponse();
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(bandPage.getTotalPages());
        response.setTotalCount(bandPage.getTotalElements());
        response.setBands(bandPage.getContent());

        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MusicBand> createMusicBand(@Valid @RequestBody MusicBandRequest musicBandRequest) {
        MusicBand createdMusicBand = musicBandService.createMusicBand(musicBandRequest);
        return new ResponseEntity<>(createdMusicBand, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MusicBand> getMusicBandById(@PathVariable @Min(1) Integer id) {
        return musicBandService.getMusicBandById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMusicBandById(@PathVariable @Min(1) Integer id) {
        try {
            musicBandService.deleteMusicBandById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping ("/{id}")
    public ResponseEntity<MusicBand> updateMusicBand(@Valid @RequestBody MusicBandRequest musicBandRequest, @PathVariable @Min(1) Integer id) {
        MusicBand updatedMusicBand = musicBandService.updateMusicBand(id, musicBandRequest);
        return ResponseEntity.ok(updatedMusicBand);
    }

    @GetMapping("/singles/equally/{singlesCount}")
    public ResponseEntity<CountResponse> getCountMusicBandsBySinglesCountEqually(@PathVariable Long singlesCount) {
        Long musicBandsCount = musicBandService.getMusicBandsCountBySinglesCount(singlesCount);
        CountResponse countResponse = new CountResponse(musicBandsCount);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_XML).body(countResponse);
    }

    @GetMapping("/singles/greater/{singlesCount}")
    public ResponseEntity<CountResponse> getCountMusicBandsSinglesCountGreaterThan(@PathVariable Long singlesCount) {
        Long musicBandsCount = musicBandService.getMusicBandsCountBySinglesCountGreaterThan(singlesCount);
        CountResponse countResponse = new CountResponse(musicBandsCount);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_XML).body(countResponse);
    }

    @PostMapping(value = "/search-by-name", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<BandSearchResponse> getMusicBandsByNameSubstring(
                            @RequestParam(defaultValue = "1") @Min(1) int page,
                            @RequestParam(defaultValue = "10") @Min(1) int size,
                            @Valid @RequestBody SubstringRequest substring) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        String nameSubstring = substring.getValue();
        Page<MusicBand> bandPage = musicBandService.findByNameContaining(nameSubstring, pageable);

        BandSearchResponse response = new BandSearchResponse();
        response.setPage(page);
        response.setTotalPages(bandPage.getTotalPages());
        response.setSize(size);
        response.setTotalCount(bandPage.getTotalElements());
        response.setBands(bandPage.getContent());

        return ResponseEntity.ok(response);
    }
}
