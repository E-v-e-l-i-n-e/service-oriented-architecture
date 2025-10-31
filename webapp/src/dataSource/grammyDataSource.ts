import { baseBandsApiUrl, baseGrammyApiUrl } from "./ApiConstants";
import MusicBand from "../models/MusicBand";
import Coordinates from "../models/Coordinates";
import { MusicGenre } from "../models/MusicGenre";
import Label from "../models/Label";

export class GrammyDataSource {
    private baseUrl: string;

    constructor(baseUrl: string = baseGrammyApiUrl) {
        this.baseUrl = baseUrl;
    }

    async addSingleToBand(bandId: number): Promise<MusicBand> {
        const response = await fetch(`${this.baseUrl}band/${bandId}/singles/add`, {
        method: 'POST',
        headers: {
            'Accept': 'application/xml',
        },
    });

    const xmlText = await response.text();

    if (!response.ok) {
        const err = this.extractErrorMessage(xmlText) ?? `HTTP ${response.status}`;
            throw new Error(err);
        }

        return this.parseBandFromXml(xmlText);
    }

    
    async removeParticipantFromBand(bandId: number): Promise<MusicBand> {
        const response = await fetch(`${this.baseUrl}band/${bandId}/participants/remove`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/xml',
        },
    });

    const xmlText = await response.text();

    if (!response.ok) {
            const err = this.extractErrorMessage(xmlText) ?? `HTTP ${response.status}`;
            throw new Error(err);
        }

        return this.parseBandFromXml(xmlText);
}

private extractErrorMessage(xml: string): string | null {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, "text/xml");
            return (
                doc.querySelector("message")?.textContent ??
                doc.querySelector("error")?.textContent ??
                null
            );
        } catch {
            return null;
        }
    }

private parseBandFromXml(xml: string): MusicBand {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");

        const id = parseInt(doc.querySelector("id")?.textContent ?? "0", 10);
        const name = doc.querySelector("name")?.textContent ?? "";
        const rawDate = doc.querySelector("creationDate")?.textContent ?? "";
        const creationDate = rawDate ? new Date(rawDate) : null;

        const numberOfParticipants = parseInt(
            doc.querySelector("numberOfParticipants")?.textContent ?? "0",
            10
        );
        const singlesCount = parseInt(
            doc.querySelector("singlesCount")?.textContent ?? "0",
            10
        );
        const albumsCount = parseInt(
            doc.querySelector("albumsCount")?.textContent ?? "0",
            10
        );

        const coordX = parseInt(
            doc.querySelector("coordinates x")?.textContent ?? "0",
            10
        );
        const coordY = parseInt(
            doc.querySelector("coordinates y")?.textContent ?? "0",
            10
        );
        const coordinates: Coordinates = { x: coordX, y: coordY };

        const genreStr = doc.querySelector("musicGenre")?.textContent ?? "HIP_HOP";
        const genre = MusicGenre[genreStr as keyof typeof MusicGenre];

        const labelName = doc.querySelector("label name")?.textContent;
        const labelSales = parseInt(
            doc.querySelector("label sales")?.textContent ?? "0",
            10
        );
        const label: Label | null = labelName
            ? { name: labelName, sales: labelSales }
            : null;

        return {
            id,
            name,
            coordinates,
            creationDate,
            numberOfParticipants,
            singleCount: singlesCount,     
            genre,
            label,
        } as MusicBand;
    }
}