import Coordinates from "./Coordinates";
import {MusicGenre} from "./MusicGenre";
import Label from "./Label";

export default class MusicBand {
    constructor(
        public id: number,
        public name: string,
        public coordinates: Coordinates,
        public creationDate: Date,
        public numberOfParticipants: number,
        public singleCount: number,
        public albumsCount: number,
        public genre: MusicGenre,
        public label: Label | null | undefined,
    ) {}
}