import MusicBand from '../models/MusicBand';
import BandRequest from '../models/BandRequest';
import BandSearchRequest from '../models/BandSearchRequest';
import PaginatedResponse from '../models/PaginatedResponse';
import Coordinates from '../models/Coordinates';
import { MusicGenre } from '../models/MusicGenre';
import { baseBandsApiUrl, baseGrammyApiUrl } from './ApiConstants';
import Label from '../models/Label';

export class MusicBandDataSource {
    private baseUrl: string;

    constructor(baseUrl: string = baseBandsApiUrl) {
        this.baseUrl = baseUrl;
    }

    async getBandById(id: number): Promise<MusicBand> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/xml',
            },
        });

        if (!response.ok) {
            throw new Error(`Группа с ID ${id} не найдена: ${response.statusText}`);
        }

        const xmlData = await response.text();
        return this.parseBandFromXml(xmlData);
    }


    async createBand(bandRequest: BandRequest): Promise<MusicBand> {
        const xmlBody = this.bandRequestToXml(bandRequest);

        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml',
            },
            body: xmlBody,
        });

        if (!response.ok) {
            throw new Error(`Failed to create band: ${response.statusText}`);
        }

        const xmlData = await response.text();
        return this.parseBandFromXml(xmlData);
    }


    async updateBand(id: number, bandRequest: BandRequest): Promise<MusicBand> {
        const xmlBody = this.bandRequestToXml(bandRequest);

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml',
            },
            body: xmlBody,
        });

        if (!response.ok) {
            throw new Error(`Failed to update band with id ${id}: ${response.statusText}`);
        }

        const xmlData = await response.text();
        return this.parseBandFromXml(xmlData);
    }


    async deleteBand(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete band with id ${id}: ${response.statusText}`);
        }
    }



    async getBandsWithFilters(
       searchRequest: BandSearchRequest,
        page: number = 1,
        size: number = 10
    ): Promise<PaginatedResponse<MusicBand>> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (searchRequest.sort) {
        params.append('sort', searchRequest.sort);
    }

       const xmlBody = this.searchRequestToXml(searchRequest);

        const response = await fetch(`${this.baseUrl}/filters?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml',
            },
            body: xmlBody,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch bands with filters: ${response.statusText}`);
        }

        const xmlData = await response.text();
        return this.parsePaginatedBandsFromXml(xmlData);
    }


async getAllBands(page: number = 1, size: number = 10): Promise<PaginatedResponse<MusicBand>> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    const response = await fetch(`${this.baseUrl}/filters?${params}`, { // Используем /filters
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml',
        },
        body: '<BandSearchRequest></BandSearchRequest>', // Отправляем пустое тело для фильтров
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`getAllBands failed: ${response.status} ${text}`);
    }

    const xmlData = await response.text();
    return this.parsePaginatedBandsFromXml(xmlData);
}

  async searchBandsByName(
    substring: string,
    page: number = 1,
    size: number = 10
): Promise<PaginatedResponse<MusicBand>> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    // Тело запроса, как на вашем скриншоте
    const xmlBody = `<substring><value>${substring}</value></substring>`;

    const response = await fetch(`${this.baseUrl}/search-by-name?${params}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml',
        },
        body: xmlBody,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`searchBandsByName failed: ${response.status} ${text}`);
    }

    const xmlData = await response.text();
    return this.parsePaginatedBandsFromXml(xmlData);
}




    async countBandsWithEqualSingles(singlesCount: number): Promise<number> {
        const response = await fetch(`${this.baseUrl}/singles/equally/${singlesCount}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/xml',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to count bands with equal singles: ${response.statusText}`);
        }

        const xmlData = await response.text();
        return this.parseCountFromXml(xmlData);
    }


    async countBandsWithGreaterSingles(singlesCount: number): Promise<number> {
        const response = await fetch(`${this.baseUrl}/singles/greater/${singlesCount}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/xml',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to count bands with greater singles: ${response.statusText}`);
        }

        const xmlData = await response.text();
        return this.parseCountFromXml(xmlData);
    }


   private parseBandFromXml(xmlData: string): MusicBand {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlData, 'text/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
        throw new Error('Band XML parse error: ' + parserError.textContent);
    }

    const id = parseInt(doc.querySelector('id')?.textContent || '0');
    const name = doc.querySelector('name')?.textContent || '';
    const creationDateStr = doc.querySelector('creationDate')?.textContent || '';
    const creationDate = new Date(creationDateStr);
    const numberOfParticipants = parseInt(doc.querySelector('numberOfParticipants')?.textContent || '0');
    const singlesCount = parseInt(doc.querySelector('singlesCount')?.textContent || '0');
    const albumsCount = parseInt(doc.querySelector('albumsCount')?.textContent || '0');

    const coordinates = doc.querySelector('coordinates');
    const coordX = parseInt(coordinates?.querySelector('x')?.textContent || '0');
    const coordY = parseInt(coordinates?.querySelector('y')?.textContent || '0');
    const coordinatesObj: Coordinates = { x: coordX, y: coordY };

    const genreStr = doc.querySelector('genre')?.textContent || 'HIP_HOP';
    const genre = MusicGenre[genreStr as keyof typeof MusicGenre];

    const label = doc.querySelector('label');
    const labelName = label?.querySelector('name')?.textContent || '';
    const labelSales = parseInt(label?.querySelector('sales')?.textContent || '0');
    const labelObj = labelName ? { name: labelName, sales: labelSales } : null;

    return new MusicBand(
        id,
        name,
        coordinatesObj,
        creationDate,
        numberOfParticipants,
        singlesCount,
        albumsCount,
        genre,
        labelObj
    );
}
// MusicBandDataSource.ts

// Исправленный парсер для страницы с группами
private parsePaginatedBandsFromXml(xmlData: string): PaginatedResponse<MusicBand> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlData, 'application/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
        throw new Error('XML Parse Error: ' + parserError.textContent);
    }

    const paginationNode = doc.querySelector('pagination');
    const page = parseInt(paginationNode?.querySelector('page')?.textContent || '1');
    const totalPages = parseInt(paginationNode?.querySelector('totalPages')?.textContent || '1');
    const totalCount = parseInt(paginationNode?.querySelector('totalCount')?.textContent || '0');
    const size = parseInt(paginationNode?.querySelector('size')?.textContent || '10');

    let bandElements = doc.querySelectorAll('bands > band');

// Если ничего не нашлось, значит, это ответ от /filters. Ищем по другому селектору.
if (bandElements.length === 0) {
    bandElements = doc.querySelectorAll('bands > bands');
}

    const bands: MusicBand[] = Array.from(bandElements).map(bandEl => {
        // ПЕРЕИСПОЛЬЗУЕМ parseBandFromXml, но передаем ему элемент, а не строку
        return this.parseSingleBandElement(bandEl);
    });

    return {
        // В вашем интерфейсе PaginatedResponse поле называется 'bands', а не 'content'
        bands, 
        pagination: { page, totalPages, totalCount, size }
    };
}

// Создадим новую вспомогательную функцию для парсинга ОДНОГО элемента
private parseSingleBandElement(bandEl: Element): MusicBand {
    const id = parseInt(bandEl.querySelector('id')?.textContent || '0');
    const name = bandEl.querySelector('name')?.textContent || '';
    
    // ... остальная логика из parseBandFromXml, но вместо 'doc' используется 'bandEl'
    const creationDateStr = bandEl.querySelector('creationDate')?.textContent || '';
    const creationDate = new Date(creationDateStr);
    const numberOfParticipants = parseInt(bandEl.querySelector('numberOfParticipants')?.textContent || '0');
    // и так далее для всех полей...

    const coordinates = bandEl.querySelector('coordinates');
    const coordX = parseInt(coordinates?.querySelector('x')?.textContent || '0');
    const coordY = parseInt(coordinates?.querySelector('y')?.textContent || '0');
    const coordinatesObj: Coordinates = { x: coordX, y: coordY };
    
    const singlesCount = parseInt(bandEl.querySelector('singlesCount')?.textContent || '0');
    const albumsCount = parseInt(bandEl.querySelector('albumsCount')?.textContent || '0');
    const genreStr = bandEl.querySelector('genre')?.textContent || 'HIP_HOP';
    const genre = MusicGenre[genreStr as keyof typeof MusicGenre];
    
    
const labelEl = bandEl.querySelector('label'); // Получаем элемент <label>

let labelObj: Label | null = null; // Инициализируем как null

if (labelEl) {
    // Если элемент <label> существует
    const salesText = labelEl.querySelector('sales')?.textContent;
    const nameText = labelEl.querySelector('name')?.textContent; // Достаем имя

    // Проверяем, что есть хотя бы одно из полей, чтобы не создавать пустой объект
    if (salesText || nameText) {
        labelObj = {
            name: nameText || '', // Если имени нет, ставим пустую строку
            sales: parseInt(salesText || '0'), // Если продаж нет, ставим 0
        };
    }
}
    
    return new MusicBand(
        id, name, coordinatesObj, creationDate, numberOfParticipants,
        singlesCount, albumsCount, genre, labelObj
    );
}

// Старый parseBandFromXml можно оставить для getBandById, 
// но лучше унифицировать и использовать parseSingleBandElement.



    private parseCountFromXml(xmlData: string): number {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlData, 'text/xml');
        return parseInt(doc.querySelector('value')?.textContent || '0');
    }

    private bandRequestToXml(bandRequest: BandRequest): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<bandRequest>
    <name>${bandRequest.name}</name>
    <coordinates>
        <x>${bandRequest.coordinates.x}</x>
        <y>${bandRequest.coordinates.y}</y>
    </coordinates>
    <numberOfParticipants>${bandRequest.numberOfParticipants}</numberOfParticipants>
    <albumsCount>${bandRequest.albumsCount}</albumsCount>
    <singlesCount>${bandRequest.singlesCount}</singlesCount>
    <musicGenre>${bandRequest.musicGenre}</musicGenre>
    ${bandRequest.label ? `
    <label>
        <name>${bandRequest.label.name}</name>
        <sales>${bandRequest.label.sales}</sales>
    </label>` : '<label/>'}
</bandRequest>`;
    }

    private searchRequestToXml(searchRequest: BandSearchRequest): string {
        let xml = '<?xml version="1.0" encoding="UTF-8"?><bandSearchRequest>';
        console.log(xml)

        if (searchRequest.name) xml += `<name>${searchRequest.name}</name>`;
        if (searchRequest.genre) xml += `<genre>${searchRequest.genre}</genre>`;
        if (searchRequest.numberOfParticipants) xml += `<numberOfParticipants>${searchRequest.numberOfParticipants}</numberOfParticipants>`;
        if (searchRequest.singlesCount) xml += `<singlesCount>${searchRequest.singlesCount}</singlesCount>`;
        if (searchRequest.albumsCount) xml += `<albumsCount>${searchRequest.albumsCount}</albumsCount>`;

        xml += '</bandSearchRequest>';
        return xml;
    }
}