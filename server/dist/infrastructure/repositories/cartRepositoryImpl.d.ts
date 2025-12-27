export interface CartItemRecord {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
    product_name?: string;
    price?: number;
    thumbnail_url?: string | null;
    stock_quantity?: number;
}
export interface CartRecord {
    id: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}
declare class CartRepository {
    getOrCreateCart(userId: number): Promise<CartRecord>;
    getItemsByUser(userId: number): Promise<CartItemRecord[]>;
    addItem(userId: number, productId: number, quantity: number): Promise<CartItemRecord[]>;
    updateItem(itemId: number, userId: number, quantity: number): Promise<CartItemRecord[]>;
    removeItem(itemId: number, userId: number): Promise<CartItemRecord[]>;
    clear(userId: number): Promise<void>;
}
declare const cartRepository: CartRepository;
export default cartRepository;
//# sourceMappingURL=cartRepositoryImpl.d.ts.map