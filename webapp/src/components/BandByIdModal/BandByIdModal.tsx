import React, { useState } from 'react';
import MusicBand from '../../models/MusicBand';
import styles from './BandByIdModal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onFetch: (id: number) => Promise<MusicBand>;
}

const BandByIdModal: React.FC<Props> = ({ isOpen, onClose, onFetch }) => {
    const [inputId, setInputId] = useState('');
    const [band, setBand] = useState<MusicBand | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const id = parseInt(inputId);
        if (isNaN(id) || id <= 0) {
            setError('Введите корректный ID');
            return;
        }

        setLoading(true);
        setError(null);
        setBand(null);

        try {
            const result = await onFetch(id);
            setBand(result);
        } catch (err: any) {
            setError(err.message || 'Группа не найдена');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>×</button>

                <h3 className={styles.title}>Найти группу по ID</h3>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="number"
                        min="1"
                        value={inputId}
                        onChange={e => setInputId(e.target.value)}
                        placeholder="ID группы..."
                        className={styles.input}
                        autoFocus
                    />
                    <button type="submit" disabled={loading} className={styles.submit}>
                        {loading ? 'Поиск...' : 'Найти'}
                    </button>
                </form>

                {error && <p className={styles.error}>{error}</p>}

                {band && (
                    <div className={styles.card}>
                        <h4 className={styles.bandName}>{band.name}</h4>
                        <div className={styles.info}>
                            <p><strong>ID:</strong> {band.id}</p>
                            <p><strong>Жанр:</strong> {band.genre}</p>
                            <p><strong>Синглы:</strong> {band.singleCount}</p>
                            <p><strong>Участники:</strong> {band.numberOfParticipants}</p>
                            <p><strong>Альбомы:</strong> {band.albumsCount}</p>
                            <p><strong>Дата создания:</strong> {band.creationDate ? new Date(band.creationDate).toLocaleDateString() : '-'}</p>
                            <p><strong>Координаты:</strong> {band.coordinates ? `${band.coordinates.x}, ${band.coordinates.y}` : '-'}</p>
                            <p><strong>Продажи:</strong> {band.label?.sales ?? '0'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BandByIdModal;