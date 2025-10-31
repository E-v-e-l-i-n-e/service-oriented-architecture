package com.evelina.labs.service;

import com.evelina.labs.dto.BandSearchRequest;
import com.evelina.labs.dto.MusicBandRequest;
import com.evelina.labs.models.MusicBand;
import com.evelina.labs.models.MusicGenre;
import com.evelina.labs.repository.MusicBandRepository;
import com.evelina.labs.repository.MusicBandSpecification;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MusicBandService {

    private final MusicBandRepository musicBandRepository;

    public MusicBandService(MusicBandRepository musicBandRepository) {
        this.musicBandRepository = musicBandRepository;
    }

    public MusicBand createMusicBand(MusicBandRequest musicBandRequest) {
        if (musicBandRequest.getNumberOfParticipants() != null && musicBandRequest.getNumberOfParticipants() > 100) {
            throw new IllegalArgumentException("Количество участников не может превышать 100");
        }
        MusicBand musicBand = MusicBand.builder()
                .name(musicBandRequest.getName())
                .coordinates(musicBandRequest.getCoordinates())
                .numberOfParticipants(musicBandRequest.getNumberOfParticipants())
                .singlesCount(musicBandRequest.getSinglesCount())
                .albumsCount(musicBandRequest.getAlbumsCount())
                .genre(musicBandRequest.getMusicGenre())
                .label(musicBandRequest.getLabel())
                .build();
        return musicBandRepository.save(musicBand);
    }

    public Page<MusicBand> getBandsWithFilterAndPagination(BandSearchRequest request, Pageable pageable) {
        if (request.getNumberOfParticipants() != null && request.getNumberOfParticipants() > 100) {
            throw new IllegalArgumentException(
                    "Невозможно выполнить фильтрацию: количество участников " +
                            request.getNumberOfParticipants() + " превышает максимально допустимое значение (100)."
            );
        }

        Specification<MusicBand> spec = MusicBandSpecification.searchByCriteria(request);
        return musicBandRepository.findAll(spec, pageable);
    }

    public Optional<MusicBand> getMusicBandById(Integer id) {
        return musicBandRepository.findById(id);
    }

    public void deleteMusicBandById(Integer id) {
        if (!musicBandRepository.existsById(id)) {
            throw new EntityNotFoundException("Группа с ID " + id + " не найдена");
        }
        musicBandRepository.deleteById(id);
    }

    public MusicBand updateMusicBand(Integer id, MusicBandRequest musicBandRequest) {
        MusicBand existingBand = musicBandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Объект с ID " + id + " не существует"));

        if (musicBandRequest.getNumberOfParticipants() != null && musicBandRequest.getNumberOfParticipants() > 100) {
            throw new IllegalArgumentException("Количество участников не может превышать 100");
        }

        existingBand.setName(musicBandRequest.getName());
        existingBand.setCoordinates(musicBandRequest.getCoordinates());
        existingBand.setNumberOfParticipants(musicBandRequest.getNumberOfParticipants());
        existingBand.setSinglesCount(musicBandRequest.getSinglesCount());
        existingBand.setAlbumsCount(musicBandRequest.getAlbumsCount());
        existingBand.setGenre(musicBandRequest.getMusicGenre());
        existingBand.setLabel(musicBandRequest.getLabel());

        return musicBandRepository.save(existingBand);
    }

    public Long getMusicBandsCountBySinglesCount(long singlesCount) {
        return musicBandRepository.countBySinglesCount(singlesCount);
    }

    public Long getMusicBandsCountBySinglesCountGreaterThan(long singlesCount) {
        return musicBandRepository.countBySinglesCountGreaterThan(singlesCount);
    }

    public Page<MusicBand> findByNameContaining(String nameSubstring, Pageable pageable) {
        return musicBandRepository.findByNameContaining(nameSubstring, pageable);
    }

    public void addSingleToBand(Integer bandId) {
        MusicBand band = musicBandRepository.findById(bandId)
                .orElseThrow(() -> new EntityNotFoundException("Группа с ID " + bandId + " не найдена."));

        Long currentSingles = band.getSinglesCount() != null ? band.getSinglesCount() : 0L;
        band.setSinglesCount(currentSingles + 1);

        musicBandRepository.save(band);
    }

    public void removeParticipantFromBand(Integer bandId) {
        MusicBand band = musicBandRepository.findById(bandId)
                .orElseThrow(() -> new EntityNotFoundException("Группа с ID " + bandId + " не найдена."));

        Long currentParticipants = band.getNumberOfParticipants() != null ? band.getNumberOfParticipants() : 0L;

        if (currentParticipants <= 1) {
            throw new IllegalArgumentException("Невозможно удалить участника: группа должна иметь минимум 1 участника.");
        }
        band.setNumberOfParticipants(currentParticipants - 1);

        musicBandRepository.save(band);
    }
}
