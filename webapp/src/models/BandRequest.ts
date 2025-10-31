import { MusicGenre } from './MusicGenre';
import Label from './Label';
import Coordinates from './Coordinates';

export default interface BandRequest {
    name: string;
    coordinates: Coordinates;
    numberOfParticipants: number;
    albumsCount: number;
    singlesCount: number;
    musicGenre: MusicGenre;
    label: Label | null;
}