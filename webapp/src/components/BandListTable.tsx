import React, { useState, useEffect } from 'react';
import  MusicBand  from '../models/MusicBand';
import BandRequest from '../models/BandRequest';
import BandSearchRequest from '../models/BandSearchRequest';
import {useViewModels} from '../context/ViewModelsContext';
import CreateBandModal from './CreateBandModal/CreateBandModal';
import CountSinglesModal from './CountSinglesModal/CountSinglesModal';
import GrammyActionModal from './GrammyActionModal/GrammyActionModal';
import BandByIdModal from './BandByIdModal/BandByIdModal';
import EditBandModal from './EditBandModal/EditBandModal';
import ReactPaginate from 'react-paginate';
import { Edit, Trash2, Search, ArrowUp, ArrowDown, X } from 'lucide-react';
import styles from './BandListTable.module.css';

const BandListTable: React.FC = () => {
    const { musicBandVM: viewModel, grammyVM } = useViewModels();

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
    
    const [filters, setFilters] = useState<BandSearchRequest>({
        name: '',
        genre: undefined,
        numberOfParticipants: undefined,
        singlesCount: undefined,
        albumsCount: undefined,
        sort: '',
    });

   
    const bands = viewModel.getBands();
    const [pagination, setPagination] = useState({ totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showGreaterModal, setShowGreaterModal] = useState(false);
    const [showEqualModal, setShowEqualModal] = useState(false);
    const [showAddSingleModal, setShowAddSingleModal] = useState(false);
    const [showRemoveParticipantModal, setShowRemoveParticipantModal] = useState(false);
    const [showBandByIdModal, setShowBandByIdModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBand, setEditingBand] = useState<MusicBand | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    

  
    useEffect(() => {
        const unsubscribe = viewModel.subscribe((state) => {
            setLoading(state.loading);
            setError(state.error);
            // setBands(viewModel.getBands());

            const info = viewModel.getPaginationInfo();
            if (info) {
                setPagination({
                    totalPages: info.totalPages,
                    totalElements: info.totalCount,
                });
            } else {
                setPagination({ totalPages: 0, totalElements: 0 });
            }
        });

        return () => unsubscribe();
    }, [viewModel]);

    // Load data based on context
    const loadData = async () => {
        setLoading(true);
        try {
            if (lastSearchQuery !== null) {
                await viewModel.searchBandsByName(lastSearchQuery, currentPage + 1, pageSize);
            } else if (Object.values(filters).some(v => v !== '' && v !== undefined)) {
                await viewModel.loadBandsWithFilters(filters, currentPage + 1, pageSize);
            } else {
                await viewModel.loadAllBands(currentPage + 1, pageSize);
            }
        } catch (err) {
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage, lastSearchQuery, filters, pageSize]);

   
    const handleSearch = () => {
        const trimmed = search.trim();
        setCurrentPage(0);
        setLastSearchQuery(trimmed || null);
    };

    // Filter handlers
    const handleFilterChange = (field: keyof BandSearchRequest, value: any) => {
        setCurrentPage(0);
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    // Sorting
    const toggleSort = (field: string) => {
        setCurrentPage(0);
        setFilters(prev => {
            const currentSort = prev.sort || '';
            const [currentField, currentOrder] = currentSort.split(',');

            let newSort = '';
            if (currentField === field && currentOrder === 'asc') {
                newSort = `${field},desc`;
            } else if (currentField === field && currentOrder === 'desc') {
                newSort = '';
            } else {
                newSort = `${field},asc`;
            }

            return { ...prev, sort: newSort };
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setCurrentPage(0);
        setFilters({
            name: undefined,
            genre: undefined,
            numberOfParticipants: undefined,
            singlesCount: undefined,
            albumsCount: undefined,
            sort: undefined,
        });
    };

    // Modal handlers (оставлены без изменений)
    const handleCreate = async (bandRequest: BandRequest) => {
        await viewModel.createBand(bandRequest);
        setShowCreateModal(false);
        loadData();
    };

    const handleGreaterCount = async (count: number) => {
        return await viewModel.countBandsWithGreaterSingles(count);
    };

    const handleEqualCount = async (count: number) => {
        return await viewModel.countBandsWithEqualSingles(count);
    };

    const handleFetchBand = async (id: number): Promise<MusicBand> => {
        return await viewModel.getBandById(id);
    };

    const handleAddSingle = async (bandId: number) => {
        try {
            setActionError(null);
            await grammyVM.addSingleToBand(bandId);
            loadData();
        } catch (e: any) {
            setActionError(e.message || 'Ошибка при добавлении сингла');
            setTimeout(() => setActionError(null), 5000);
        }
    };

    const handleRemoveParticipant = async (bandId: number) => {
        try {
            setActionError(null);
            await grammyVM.removeParticipantFromBand(bandId);
            loadData();
        } catch (e: any) {
            setActionError(e.message || 'Ошибка при удалении участника');
            setTimeout(() => setActionError(null), 5000);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Удалить группу?')) return;
        try {
            await viewModel.deleteBand(id);
            loadData();
        } catch (err) {
            setActionError('Не удалось удалить группу');
            setTimeout(() => setActionError(null), 3000);
        }
    };

    const handleEdit = (band: MusicBand) => {
        setEditingBand(band);
        setShowEditModal(true);
    };

    const handleUpdate = async (request: BandRequest, id: number) => {
        await viewModel.updateBand(id, request);
        setShowEditModal(false);
        setEditingBand(null);
        loadData();
    };

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const [sortField, sortOrder] = (filters.sort || '').split(',');

    return (
        <div className={styles.container}>
        
            <div className={styles.leftActionColumn}>
                <button className={styles.actionButton} onClick={() => setShowGreaterModal(true)}>
                    Группы с {'>'} X синглов
                </button>
                <button className={styles.actionButton} onClick={() => setShowEqualModal(true)}>
                    Группы с = X синглов
                </button>
                <button className={styles.actionButton} onClick={() => setShowAddSingleModal(true)}>
                    +1 сингл (по ID)
                </button>
                <button className={styles.actionButton} onClick={() => setShowRemoveParticipantModal(true)}>
                    -1 участник (по ID)
                </button>
                <button className={styles.actionButton} onClick={() => setShowBandByIdModal(true)}>
                    Найти группу по ID
                </button>
            </div>

            {/* Кнопка создания */}
            <button className={styles.createButton} onClick={() => setShowCreateModal(true)}>
                + создать
            </button>

            {/* Поиск */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className={styles.search}
                />
                <button onClick={handleSearch} className={styles.searchButton}>
                    <Search size={18} />
                </button>
            </div>

            {/* Фильтры и сортировка НАД таблицей */}
            <div className={styles.filtersSection}>
                <h3 className={styles.filtersTitle}>Фильтры и сортировка</h3>

                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <label>Название</label>
                        <input
                            type="text"
                            value={filters.name || ''}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className={styles.filterInput}
                        />
                        <button onClick={() => toggleSort('name')} className={styles.sortBtn}>
                            {sortField === 'name' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : '↕'}
                        </button>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Жанр</label>
                        <select
                            value={filters.genre || ''}
                            onChange={(e) => handleFilterChange('genre', e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">Все</option>
                            <option value="HIP_HOP">HIP_HOP</option>
                            <option value="PUNK_ROCK">PUNK_ROCK</option>
                            <option value="PROGRESSIVE_ROCK">PROGRESSIVE_ROCK</option>
                        </select>
                        <button onClick={() => toggleSort('genre')} className={styles.sortBtn}>
                            {sortField === 'genre' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : '↕'}
                        </button>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Синглы</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.singlesCount ?? ''}
                            onChange={(e) => handleFilterChange('singlesCount', e.target.valueAsNumber || undefined)}
                            className={styles.filterInput}
                        />
                        <button onClick={() => toggleSort('singlesCount')} className={styles.sortBtn}>
                            {sortField === 'singlesCount' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : '↕'}
                        </button>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Участники</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.numberOfParticipants ?? ''}
                            onChange={(e) => handleFilterChange('numberOfParticipants', e.target.valueAsNumber || undefined)}
                            className={styles.filterInput}
                        />
                        <button onClick={() => toggleSort('numberOfParticipants')} className={styles.sortBtn}>
                            {sortField === 'numberOfParticipants' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : '↕'}
                        </button>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Альбомы</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.albumsCount ?? ''}
                            onChange={(e) => handleFilterChange('albumsCount', e.target.valueAsNumber || undefined)}
                            className={styles.filterInput}
                        />
                        <button onClick={() => toggleSort('albumsCount')} className={styles.sortBtn}>
                            {sortField === 'albumsCount' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : '↕'}
                        </button>
                    </div>
                </div>

                <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                    <X size={16} /> Очистить фильтры
                </button>
            </div>

            {/* Таблица */}
            {loading && <div className={styles.loading}>Загрузка...</div>}
            {error && <div className={styles.error}>Ошибка: {error}</div>}
            {!loading && !error && bands.length === 0 && (
                <div className={styles.empty}>Список групп пуст.</div>
            )}

            {bands.length > 0 && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Жанр</th>
                            <th>Синглы</th>
                            <th>Участники</th>
                            <th>Альбомы</th>
                            <th>Дата Создания</th>
                            <th>Координаты (X,Y)</th>
                            <th>Продажи</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bands.map((band) => (
                            <tr key={band.id}>
                                <td>{band.id}</td>
                                <td>{band.name}</td>
                                <td>{band.genre}</td>
                                <td>{band.singleCount}</td>
                                <td>{band.numberOfParticipants}</td>
                                <td>{band.albumsCount}</td>
                                <td>
                                    {band.creationDate
                                        ? new Date(band.creationDate).toLocaleDateString()
                                        : '-'}
                                </td>
                                <td>
                                    {band.coordinates
                                        ? `${band.coordinates.x}, ${band.coordinates.y}`
                                        : '-'}
                                </td>
                                <td className={styles.salesCell}>
                                    <span className={styles.salesText}>
                                        {band.label?.sales ?? '0'}
                                    </span>
                                    <div className={styles.actionButtons}>
                                        <button
                                            onClick={() => handleEdit(band)}
                                            className={styles.actionBtn}
                                            title="Редактировать"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(band.id)}
                                            className={`${styles.actionBtn} ${styles.delete}`}
                                            title="Удалить"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Пагинация */}
            {pagination.totalPages > 1 && (
                <ReactPaginate
                    previousLabel="<"
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageCount={pagination.totalPages}
                    forcePage={currentPage}
                    containerClassName={styles.pagination}
                    pageClassName={styles.pageItem}
                    activeClassName={styles.activePage}
                />
            )}

            {/* Модалки */}
            <CreateBandModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreate}
            />
            <CountSinglesModal
                isOpen={showGreaterModal}
                onClose={() => setShowGreaterModal(false)}
                type="greater"
                onSubmit={handleGreaterCount}
            />
            <CountSinglesModal
                isOpen={showEqualModal}
                onClose={() => setShowEqualModal(false)}
                type="equal"
                onSubmit={handleEqualCount}
            />
            <GrammyActionModal
                isOpen={showAddSingleModal}
                onClose={() => setShowAddSingleModal(false)}
                title="Добавить сингл"
                action={handleAddSingle}
                successMessage="Сингл добавлен!"
            />
            <GrammyActionModal
                isOpen={showRemoveParticipantModal}
                onClose={() => setShowRemoveParticipantModal(false)}
                title="Убрать участника"
                action={handleRemoveParticipant}
                successMessage="Участник убран!"
            />
            <BandByIdModal
                isOpen={showBandByIdModal}
                onClose={() => setShowBandByIdModal(false)}
                onFetch={handleFetchBand}
            />
            <EditBandModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingBand(null);
                }}
                band={editingBand}
                onUpdate={handleUpdate}
            />

            {actionError && <div className={styles.actionError}>{actionError}</div>}
        </div>
    );
};

export default BandListTable;