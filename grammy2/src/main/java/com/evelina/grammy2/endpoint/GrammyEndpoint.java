package com.evelina.grammy2.endpoint;

import com.evelina.grammy2.ws.model.AddSingleRequest;
import com.evelina.grammy2.ws.model.AddSingleResponse;
import com.evelina.grammy2.ws.model.RemoveParticipantRequest;
import com.evelina.grammy2.ws.model.RemoveParticipantResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

@Endpoint
public class GrammyEndpoint {
    private static final String NAMESPACE_URI = "http://com.evelina/grammy2";
    private final RestTemplate restTemplate;

    public GrammyEndpoint(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    private static final String BANDS_URL = "http://localhost:8083/grammy/band/";

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addSingleRequest")
    @ResponsePayload
    public AddSingleResponse addSingle(@RequestPayload AddSingleRequest request) {
        AddSingleResponse response = new AddSingleResponse();
        try {
            Long bandId = request.getBandId();
            if (bandId <= 0) {
                throw new IllegalArgumentException("Некорректный ID группы");
            }
            String bandsUrl = BANDS_URL + bandId + "/singles/add";
            ResponseEntity<String> bandsResponse = restTemplate.postForEntity(bandsUrl, null, String.class);
            if (bandsResponse.getStatusCode().is4xxClientError()) {
                throw new IllegalArgumentException("Некорректный запрос к Bands: " + bandsResponse.getBody());
            }
            if (bandsResponse.getStatusCode().is5xxServerError()) {
                throw new RuntimeException("Bands-сервер упал: " + bandsResponse.getBody());
            }
            response.setResult("Сингл добавлен: " + bandsResponse.getBody());
        } catch (Exception e) {
            response.setResult("Ошибка: " + e.getMessage());
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "removeParticipantRequest")
    @ResponsePayload
    public RemoveParticipantResponse removeParticipant(@RequestPayload RemoveParticipantRequest request) {
        RemoveParticipantResponse response = new RemoveParticipantResponse();

        try {
            Long bandId = request.getBandId();
            if (bandId <= 0) {
                throw new IllegalArgumentException("Некорректный ID группы");
            }
            String bandsUrl = BANDS_URL + bandId + "/participants/remove";
            ResponseEntity<Void> bandsResponse = restTemplate.exchange(bandsUrl, HttpMethod.DELETE, null, Void.class);
            if (bandsResponse.getStatusCode().is4xxClientError()) {
                throw new IllegalArgumentException("Некорректный запрос к Bands: " + bandsResponse.getBody());
            }
            if (bandsResponse.getStatusCode().is5xxServerError()) {
                throw new RuntimeException("Bands-сервер упал: " + bandsResponse.getBody());
            }
        response.setResult("Участник удалён из группы " + request.getBandId());
        } catch (Exception e) {
            response.setResult("Ошибка: " + e.getMessage());
        }
        return response;
    }
}
