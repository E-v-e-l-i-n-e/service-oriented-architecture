import React, { useState } from 'react';
import { MusicGenre } from "../../models/MusicGenre";
import BandRequest from '../../models/BandRequest';
import Coordinates from '../../models/Coordinates';
import Label from '../../models/Label';
import styles from './CreateBandModal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (band: BandRequest) => Promise<void>;
}

const CreateBandModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
    const [form, setForm] = useState<BandRequest>({
        name: '',
        coordinates: { x: 0, y: 0 },
        numberOfParticipants: 1,
        singlesCount: 0,
        albumsCount: 0,
        musicGenre: MusicGenre.PROGRESSIVE_ROCK,
        label: null,
    });

    const [labelEnabled, setLabelEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        setLoading(true);
        try {
            await onCreate(form);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>×</button>

                <h2 className={styles.title}>Создать группу</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Название *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            placeholder="Блестящие"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>X</label>
                            <input
                                type="number"
                                value={form.coordinates.x}
                                onChange={e => setForm({
                                    ...form,
                                    coordinates: { ...form.coordinates, x: parseInt(e.target.value) || 0 }
                                })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Y</label>
                            <input
                                type="number"
                                value={form.coordinates.y}
                                onChange={e => setForm({
                                    ...form,
                                    coordinates: { ...form.coordinates, y: parseInt(e.target.value) || 0 }
                                })}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Участники</label>
                            <input
                                type="number"
                                min="1"
                                value={form.numberOfParticipants}
                                onChange={e => setForm({ ...form, numberOfParticipants: parseInt(e.target.value) || 1 })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Синглы</label>
                            <input
                                type="number"
                                min="0"
                                value={form.singlesCount}
                                onChange={e => setForm({ ...form, singlesCount: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className={styles.field}>
    <label>Альбомы</label>
    <input
        type="number"
        min="0"
        value={form.albumsCount}
        onChange={e => setForm({ ...form, albumsCount: parseInt(e.target.value) || 0 })}
    />
</div>

                    <div className={styles.field}>
                        <label>Жанр</label>
                        <select
                            value={form.musicGenre}
                           onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const value = e.currentTarget.value;
                            if (value in MusicGenre) {
                                setForm({ ...form, musicGenre: value as MusicGenre });
                            }
                        }}
                    >
                        {Object.values(MusicGenre).map(genre => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                    </div>

                    <div className={styles.checkbox}>
                        <label>
                            <input
                                type="checkbox"
                                checked={labelEnabled}
                                onChange={e => setLabelEnabled(e.target.checked)}
                            />
                            Добавить лейбл
                        </label>
                    </div>

                    {labelEnabled && (
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Продажи</label>
                                <input
                                    type="number"
                                    min="0"
                                    onChange={e => setForm({
                                        ...form,
                                        label: { ...(form.label || { name: '', sales: 0 }), sales: parseInt(e.target.value) || 0 }
                                    })}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancel}>
                            Отмена
                        </button>
                        <button type="submit" disabled={loading} className={styles.submit}>
                            {loading ? 'Создаём...' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBandModal;