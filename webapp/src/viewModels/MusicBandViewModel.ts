import MusicBand from '../models/MusicBand';
import BandRequest from '../models/BandRequest';
import BandSearchRequest from '../models/BandSearchRequest';
import { MusicBandDataSource } from '../dataSource/musicBandDataSource';
import PaginatedResponse from '../models/PaginatedResponse';
import ViewState from '../states/ViewState';
import { BandPageResponse } from '../components/ApiClient';

export class MusicBandViewModel {
    private dataSource: MusicBandDataSource;
    private state: ViewState;
    private stateListeners: Array<(state: ViewState) => void> = [];

    private bands: MusicBand[] = [];
    private currentBand: MusicBand | null = null;
    private paginationInfo: {
        page: number;
        totalPages: number;
        totalCount: number;
        size: number;
    } | null = null;

    constructor() {
        this.dataSource = new MusicBandDataSource();
        this.state = {
            loading: false,
            error: null,
        };
    }

    subscribe(listener: (state: ViewState) => void): () => void {
        this.stateListeners.push(listener);
        return () => {
            this.stateListeners = this.stateListeners.filter(l => l !== listener);
        };
    }


    private notifyStateChange(): void {
        this.stateListeners.forEach(listener => listener(this.state));
    }

    private setLoading(loading: boolean): void {
        this.state = { ...this.state, loading };
        this.notifyStateChange();
    }

    private setError(error: string | null): void {
        this.state = { ...this.state, error };
        this.notifyStateChange();
    }


    getState(): ViewState {
        return this.state;
    }

    getBands(): MusicBand[] {
        return this.bands;
    }


    getCurrentBand(): MusicBand | null {
        return this.currentBand;
    }


    getPaginationInfo() {
        return this.paginationInfo;
    }


    async getBandById(id: number): Promise<MusicBand> {
        try {
            this.setLoading(true);
            this.setError(null);

            const currentBand = await this.dataSource.getBandById(id);

            this.setLoading(false);
            return currentBand;
        } catch (error: any) {
            this.setError(error.message);
            this.setLoading(false);
            throw error;
        }
    }

    async createBand(bandRequest: BandRequest): Promise<MusicBand> {
        try {
            this.setLoading(true);
            this.setError(null);

            const newBand = await this.dataSource.createBand(bandRequest);
            this.currentBand = newBand;

            this.bands = [newBand, ...this.bands];

            this.setLoading(false);
            return newBand;
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'Ошибка создания группы');
            this.setLoading(false);
            throw error;
        }
    }


    async updateBand(id: number, bandRequest: BandRequest): Promise<MusicBand> {
        try {
            this.setLoading(true);
            this.setError(null);

            const updatedBand = await this.dataSource.updateBand(id, bandRequest);
            this.currentBand = updatedBand;

            this.bands = this.bands.map(band =>
                band.id === id ? updatedBand : band
            );

            this.setLoading(false);
            return updatedBand;
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'Ошибка обновления группы');
            this.setLoading(false);
            throw error;
        }
    }


    async deleteBand(id: number): Promise<void> {
        try {
            this.setLoading(true);
            this.setError(null);

            await this.dataSource.deleteBand(id);

            this.bands = this.bands.filter(band => band.id !== id);

            if (this.currentBand?.id === id) {
                this.currentBand = null;
            }

            this.setLoading(false);
            
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'Ошибка удаления группы');
            this.setLoading(false);
            throw error;
        }
    }
async loadBandsWithFilters(
    searchRequest: BandSearchRequest,
    page: number = 1,
    size: number = 20
): Promise<void> {
    try {
        this.setLoading(true);
        this.setError(null);

        const response = await this.dataSource.getBandsWithFilters(searchRequest, page, size);

        this.bands = response.bands || [];
        this.paginationInfo = response.pagination;

        this.setLoading(false);
        this.notifyStateChange();
    } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Ошибка загрузки групп');
        this.setLoading(false);
    }
}

async loadAllBands(page: number = 1, size: number = 20): Promise<void> { 
    try {
        this.setLoading(true);
        this.setError(null);

        // Делаем ОДИН вызов API
        const response = await this.dataSource.getAllBands(page, size);

        // Обновляем внутреннее состояние
        this.bands = response.bands || [];
        this.paginationInfo = response.pagination;

        this.setLoading(false);
        this.notifyStateChange(); // !!! УВЕДОМЛЯЕМ КОМПОНЕНТ ОБ ИЗМЕНЕНИЯХ !!!

    } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Ошибка загрузки');
        this.setLoading(false);
    }
}

// То же самое для поиска
// МЕНЯЕМ Promise<BandPageResponse> на Promise<void>
async searchBandsByName(substring: string, page: number = 1, size: number = 20): Promise<void> {
    try {
        this.setLoading(true);
        this.setError(null);
        
        // Делаем ОДИН вызов API
        const response = await this.dataSource.searchBandsByName(substring, page, size);

        // Обновляем внутреннее состояние
        this.bands = response.bands || [];
        this.paginationInfo = response.pagination;

        this.setLoading(false);
        this.notifyStateChange(); // !!! УВЕДОМЛЯЕМ КОМПОНЕНТ !!!

    } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Ошибка поиска');
        this.setLoading(false);
    }
}


    async countBandsWithEqualSingles(singlesCount: number): Promise<number> {
        try {
            this.setLoading(true);
            this.setError(null);

            const count = await this.dataSource.countBandsWithEqualSingles(singlesCount);

            this.setLoading(false);
            return count;
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'Ошибка подсчета групп');
            this.setLoading(false);
            throw error;
        }
    }




    async countBandsWithGreaterSingles(singlesCount: number): Promise<number> {
        try {
            this.setLoading(true);
            this.setError(null);

            const count = await this.dataSource.countBandsWithGreaterSingles(singlesCount);

            this.setLoading(false);
            return count;
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'Ошибка подсчета групп');
            this.setLoading(false);
            throw error;
        }
    }


    clearCurrentBand(): void {
        this.currentBand = null;
    }


    clearBands(): void {
        this.bands = [];
        this.paginationInfo = null;
    }


    clearError(): void {
        this.setError(null);
    }
}