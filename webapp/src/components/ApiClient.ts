import MusicBand from "../models/MusicBand"; 
import Coordinates from "../models/Coordinates"; 
import Label from "../models/Label";
import {MusicGenre} from "../models/MusicGenre"; 


export interface BandPageResponse {
    content: MusicBand[];
    totalElements: number;
    totalPages: number;
    currentPage?: number;
}

function getTagValue(element: Element, tagName: string): string | null {
    return element.getElementsByTagName(tagName)[0]?.textContent || null;
}

function parseBandsXml(xmlText: string): { bands: MusicBand[], pagination: any } {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const bands: MusicBand[] = [];

    
    // --- 1. ПАРСИНГ ПАГИНАЦИИ (Метаданные) ---
    const paginationElement = xmlDoc.getElementsByTagName('pagination')[0];
    const paginationData = {
        page: paginationElement ? parseInt(getTagValue(paginationElement, 'page') || '1') : 1,
        totalPages: paginationElement ? parseInt(getTagValue(paginationElement, 'totalPages') || '1') : 1,
        totalElements: paginationElement ? parseInt(getTagValue(paginationElement, 'totalCount') || '0') : 0,
    };
    const rootElement = xmlDoc.getElementsByTagName('BandSearchResponse')[0];
    const listContainer = rootElement ? rootElement.getElementsByTagName('bands')[0] : null;

    if (listContainer) {
        // --- 3. ПАРСИНГ ЭЛЕМЕНТОВ ГРУППЫ ---
        // Каждый элемент группы также называется <bands> в вашем XML-ответе, 
        // хотя в модели это MusicBand. Используем это имя тега для поиска.
        const musicBandElements = listContainer.getElementsByTagName('bands');

        for (let i = 0; i < musicBandElements.length; i++) {
            const bandElement = musicBandElements[i];

            // --- ПАРСИНГ ПОЛЕЙ ---
            const idText = getTagValue(bandElement, 'id');
            const name = getTagValue(bandElement, 'name');
            
            // Coordinates
            let coordinates = { x: 0, y: 0 };
            const coordsElement = bandElement.getElementsByTagName('coordinates')[0];
            if (coordsElement) {
                coordinates = {
                    x: parseInt(getTagValue(coordsElement, 'x') || '0'),
                    y: parseInt(getTagValue(coordsElement, 'y') || '0'),
                };
            }
            let label = null;
            const labelElement = bandElement.getElementsByTagName('label')[0];
            if (labelElement) {
                // В вашем ответе в label есть только sales, но нет name.
                label = {
                    name: getTagValue(labelElement, 'name') || 'N/A', // В ответе отсутствует
                    sales: parseInt(getTagValue(labelElement, 'sales') || '0'),
                };
            }
            
            const creationDateText = getTagValue(bandElement, 'creationDate');
            const participantsCountText = getTagValue(bandElement, 'numberOfParticipants');
            const singleCountText = getTagValue(bandElement, 'singlesCount');
            const albumsCountText = getTagValue(bandElement, 'albumsCount');
            const genreText = getTagValue(bandElement, 'genre');

            // --- КОНСТРУИРОВАНИЕ ОБЪЕКТА MusicBand ---
            bands.push(new MusicBand(
                parseInt(idText || '0'),
                name || 'N/A',
                coordinates,
                creationDateText ? new Date(creationDateText) : new Date(0),
                parseInt(participantsCountText || '0'),
                parseInt(singleCountText || '0'),
                parseInt(albumsCountText || '0'),
                (genreText as unknown as MusicGenre) || MusicGenre.PROGRESSIVE_ROCK,
                label,
            ));
        }
    }

    return { bands, pagination: paginationData };
}

        // --- 3. ПАРСИНГ ВЛОЖЕННЫХ ПОЛЕЙ (Label) ---
       
export async function fetchBands(page: number, size: number): Promise<BandPageResponse> {
    // ВАЖНО: Укажите правильный порт (8443 для WildFly или 8445 для Jetty) и путь.
    // Используем путь без '/filters' для списка.
    const url = `https://127.0.0.1:8445/bands/filters?page=${page}&size=${size}`;
    
    console.log(`Fetching bands from: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/xml', 
                'Content-Type': 'application/xml'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка API: ${response.status} ${response.statusText}. Ответ сервера: ${errorText}`);
        }

        const xmlText = await response.text();
        
        const parsedData = parseBandsXml(xmlText);

        // ИСПРАВЛЕНИЕ TS2366: Возврат находится в блоке try, что гарантирует возврат при успехе.
        return {
            content: parsedData.bands,
            totalElements: parsedData.pagination.totalElements, 
            totalPages: parsedData.pagination.totalPages, 
        };

    } catch (error) {
        console.error("Fetch error:", error);
        // При ошибке выбрасываем ее. Это соответствует Promise<T> и устраняет TS2366 
        // (так как function ends in throw or return)
        throw error; 
    }
}