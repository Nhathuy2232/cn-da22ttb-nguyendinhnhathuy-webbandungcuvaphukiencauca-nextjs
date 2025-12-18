import categoryRepository, { CategoryRecord } from '../../infrastructure/repositories/categoryRepository';

class CategoryService {
  async list(): Promise<CategoryRecord[]> {
    return categoryRepository.list();
  }

  async findById(id: number): Promise<CategoryRecord | null> {
    return categoryRepository.findById(id);
  }

  async findByName(name: string): Promise<CategoryRecord | null> {
    return categoryRepository.findByName(name);
  }
}

const categoryService = new CategoryService();
export default categoryService;
