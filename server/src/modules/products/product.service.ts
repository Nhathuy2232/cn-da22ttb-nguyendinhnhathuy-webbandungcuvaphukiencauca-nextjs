import env from '../../config/env';
import productRepository, {
  ProductFilter,
  ProductRecord,
} from '../../infrastructure/repositories/productRepository';

class ProductService {
  async list(filter: ProductFilter = {}): Promise<{
    items: ProductRecord[];
    page: number;
    limit: number;
    total: number;
  }> {
    const limit = filter.limit ?? env.pagination.defaultLimit;
    const page = filter.offset ? Math.floor(filter.offset / limit) + 1 : 1;
    const result = await productRepository.list({ ...filter, limit });
    return { ...result, limit, page };
  }

  async findById(id: number): Promise<ProductRecord | null> {
    return productRepository.findById(id);
  }

  async create(
    data: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<ProductRecord> {
    return productRepository.create(data);
  }

  async update(
    id: number,
    data: Partial<Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>>,
  ): Promise<ProductRecord | null> {
    return productRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await productRepository.delete(id);
  }
}

const productService = new ProductService();

export default productService;

