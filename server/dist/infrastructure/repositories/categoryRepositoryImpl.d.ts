export interface CategoryRecord {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
}
declare class CategoryRepository {
    list(): Promise<CategoryRecord[]>;
    findById(id: number): Promise<CategoryRecord | null>;
    findByName(name: string): Promise<CategoryRecord | null>;
    create(data: Partial<CategoryRecord>): Promise<number>;
    update(id: number, data: Partial<CategoryRecord>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
declare const categoryRepository: CategoryRepository;
export default categoryRepository;
//# sourceMappingURL=categoryRepositoryImpl.d.ts.map