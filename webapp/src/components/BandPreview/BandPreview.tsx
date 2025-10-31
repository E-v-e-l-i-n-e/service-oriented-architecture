import React from "react";
import styles from "./BandPreview.module.css";
import MusicBand from "../../models/MusicBand";

interface Props {
    onClick?: () => void;
    musicBand: MusicBand;
}

const BandPreview: React.FC<Props> = ({onClick, musicBand}) => {
    return (
        <div
            className={styles.bandPreview}
            onClick={onClick}
        >
            <h2 className={styles.title}>{musicBand.name}</h2>
            <div> className={styles.item}
                <span className={styles.label}>ID:</span>
                <span className={styles.value}>{musicBand.id}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>Жанр:</span>
                <span className={styles.value}>{musicBand.genre}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>Количество синглов:</span>
                <span className={styles.value}>{musicBand.singleCount}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>Количество участников:</span>
                <span className={styles.value}>{musicBand.numberOfParticipants}</span>
            </div>
        </div>

    );
}

export default React.memo(BandPreview);