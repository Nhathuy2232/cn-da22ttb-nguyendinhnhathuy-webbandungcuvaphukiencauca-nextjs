import { CategoryRecord } from '../../infrastructure/repositories/categoryRepositoryImpl';
declare class CategoryService {
    list(): Promise<CategoryRecord[]>;
    findById(id: number): Promise<CategoryRecord | null>;
    findByName(name: string): Promise<CategoryRecord | null>;
}
declare const categoryService: CategoryService;
export default categoryService;
//# sourceMappingURL=category.service.d.ts.map