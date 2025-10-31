import React, { useState } from 'react';
import styles from './CountSinglesModal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type: 'greater' | 'equal';
    onSubmit: (count: number) => Promise<number>;
}

const CountSinglesModal: React.FC<Props> = ({ isOpen, onClose, type, onSubmit }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(input);
        if (isNaN(num)) {
            setError('Введите число');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const count = await onSubmit(num);
            setResult(count);
        } catch (err) {
            setError('Ошибка сервера');
        } finally {
            setLoading(false);
        }
    };

    const title = type === 'greater' 
        ? 'Группы с > X синглов' 
        : 'Группы с = X синглов';

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>×</button>

                <h3 className={styles.title}>{title}</h3>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="number"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Введите число..."
                        className={styles.input}
                        autoFocus
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    {result !== null && (
                        <p className={styles.result}>
                            Найдено групп: <strong>{result}</strong>
                        </p>
                    )}

                    <button type="submit" disabled={loading} className={styles.submit}>
                        {loading ? 'Загрузка...' : 'Получить'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CountSinglesModal;