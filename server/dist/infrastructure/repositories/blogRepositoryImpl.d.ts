export interface BlogRecord {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    author_id?: number;
    category?: string;
    tags?: string[];
    view_count: number;
    is_published: boolean;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
    author_name?: string;
}
interface BlogFilters {
    isPublished?: boolean;
    category?: string;
    search?: string;
    authorId?: number;
}
declare class BlogRepository {
    list(filters?: BlogFilters, page?: number, limit?: number): Promise<{
        blogs: BlogRecord[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<BlogRecord | null>;
    findBySlug(slug: string): Promise<BlogRecord | null>;
    create(data: Partial<BlogRecord>): Promise<number>;
    update(id: number, data: Partial<BlogRecord>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    incrementViewCount(id: number): Promise<boolean>;
    getCategories(): Promise<string[]>;
}
declare const _default: BlogRepository;
export default _default;
//# sourceMappingURL=blogRepositoryImpl.d.ts.map