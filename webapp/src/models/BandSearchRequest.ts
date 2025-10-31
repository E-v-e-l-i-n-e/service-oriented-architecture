import { MusicGenre } from './MusicGenre';

export default interface BandSearchRequest {
    sort?: string;
    name?: string;
    genre?: MusicGenre;
    numberOfParticipants?: number;
    singlesCount?: number;
    albumsCount?: number;
}
