import cartRepository from '../../infrastructure/repositories/cartRepository';
import productRepository from '../../infrastructure/repositories/productRepository';

class CartService {
  getCart(userId: number) {
    return cartRepository.getItemsByUser(userId);
  }

  async addItem(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    if (product.stock_quantity < quantity) {
      throw new Error('Số lượng tồn kho không đủ');
    }

    return cartRepository.addItem(userId, productId, quantity);
  }

  async updateItem(userId: number, itemId: number, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Số lượng phải lớn hơn 0');
    }
    return cartRepository.updateItem(itemId, userId, quantity);
  }

  removeItem(userId: number, itemId: number) {
    return cartRepository.removeItem(itemId, userId);
  }

  clear(userId: number) {
    return cartRepository.clear(userId);
  }
}

const cartService = new CartService();

export default cartService;

