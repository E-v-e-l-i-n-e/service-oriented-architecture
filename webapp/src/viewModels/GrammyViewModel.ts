import { GrammyDataSource } from '../dataSource/grammyDataSource';
import MusicBand from '../models/MusicBand';
import ViewState from '../states/ViewState';

export class GrammyViewModel {
    private dataSource: GrammyDataSource;
    private state: ViewState;
    private stateListeners: Array<(state: ViewState) => void> = [];

    constructor() {
        this.dataSource = new GrammyDataSource();
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

    

    async addSingleToBand(bandId: number): Promise<MusicBand> {
        try {
            this.setLoading(true);
            this.setError(null);
            
           const updatedBand = await this.dataSource.addSingleToBand(bandId);

        this.setLoading(false);
        return updatedBand;
    } catch (error: any) {
        const message = error.message.includes('band-id')
            ? error.message
            : 'Не удалось добавить сингл';
        this.setError(message);
        this.setLoading(false);
        throw error;
    }
    }


    async removeParticipantFromBand(bandId: number): Promise<MusicBand> {
        try {
            this.setLoading(true);
            this.setError(null);
            
            const updatedBand = await this.dataSource.removeParticipantFromBand(bandId);

        this.setLoading(false);
        return updatedBand;
    } catch (error: any) {
        const message = error.message.includes('band-id')
            ? error.message
            : 'Не удалось удалить участника';
        this.setError(message);
        this.setLoading(false);
        throw error;
    }
    }
}