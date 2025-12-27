declare class CartService {
    getCart(userId: number): Promise<import("../../infrastructure/repositories/cartRepositoryImpl").CartItemRecord[]>;
    addItem(userId: number, productId: number, quantity: number): Promise<import("../../infrastructure/repositories/cartRepositoryImpl").CartItemRecord[]>;
    updateItem(userId: number, itemId: number, quantity: number): Promise<import("../../infrastructure/repositories/cartRepositoryImpl").CartItemRecord[]>;
    removeItem(userId: number, itemId: number): Promise<import("../../infrastructure/repositories/cartRepositoryImpl").CartItemRecord[]>;
    clear(userId: number): Promise<void>;
}
declare const cartService: CartService;
export default cartService;
//# sourceMappingURL=cart.service.d.ts.map