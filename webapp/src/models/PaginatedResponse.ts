export default interface PaginatedResponse<T> {
    bands?: T[];
    pagination: {
        page: number;
        totalPages: number;
        totalCount: number;
        size: number;
    };
}