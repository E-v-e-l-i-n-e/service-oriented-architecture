package com.evelina.grammy.service;

import com.evelina.grammy.dto.ErrorResponse;
import com.evelina.grammy.dto.VoidResponse;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.io.StringReader;

@Service
@RequiredArgsConstructor
public class GrammyClientService {

    private final RestTemplate restTemplate;

    public VoidResponse removeParticipantFromBand(Integer bandId) {
        String url = "/{bandId}/participants/remove";

        try {
            ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.DELETE, null, Void.class, bandId);
            if (response.getStatusCode() == HttpStatus.OK) {
                return VoidResponse.builder().statusCode(response.getStatusCode()).build();
            }
        } catch (HttpStatusCodeException e) {
            String responseBody = e.getResponseBodyAsString();

            try {
                JAXBContext jaxbContext = JAXBContext.newInstance(ErrorResponse.class);
                Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
                ErrorResponse errorResponse = (ErrorResponse) unmarshaller.unmarshal(new StringReader(responseBody));
                return VoidResponse.builder()
                        .statusCode(e.getStatusCode())
                        .error(errorResponse)
                        .build();
            } catch (Exception ex) {
                System.err.println("Ошибка десериализации XML-ответа от Jetty: " + ex.getMessage());
                throw new RuntimeException(ex);
            }
        } catch (Exception ex) {
            System.err.println("жопа");
            throw new RuntimeException(ex);
        }
        throw new RuntimeException();
    }

    public VoidResponse addSingleToBand(Integer bandId) {
        String url = "/{bandId}/singles/add";
        try {
            ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.POST, null, Void.class, bandId);
            return VoidResponse.builder().statusCode(response.getStatusCode()).build();
        } catch (HttpStatusCodeException e) {
            String responseBody = e.getResponseBodyAsString();

            try {
                JAXBContext jaxbContext = JAXBContext.newInstance(ErrorResponse.class);
                Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
                ErrorResponse errorResponse = (ErrorResponse) unmarshaller.unmarshal(new StringReader(responseBody));
                return VoidResponse.builder()
                        .statusCode(e.getStatusCode())
                        .error(errorResponse)
                        .build();
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
