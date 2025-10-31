import React, { useState } from 'react';
import styles from './GrammyActionModal.module.css';
import MusicBand from '../../models/MusicBand';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    action: (id: number) => Promise<any>;
    successMessage: string;
}

const GrammyActionModal: React.FC<Props> = ({
    isOpen,
    onClose,
    title,
    action,
    successMessage,
}) => {
    const [inputId, setInputId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
        setSuccess(false);

        try {
        const result = await action(id); 
        setSuccess(true);
        setTimeout(() => { 
            onClose();
        }, 10000);
        } catch (err: any) {
           setError(err.response?.data?.message || err.message || 'Ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>×</button>

                <h3 className={styles.title}>{title}</h3>

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

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{successMessage}</p>}

                    <button type="submit" disabled={loading} className={styles.submit}>
                        {loading ? 'Выполняется...' : 'Выполнить'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GrammyActionModal;