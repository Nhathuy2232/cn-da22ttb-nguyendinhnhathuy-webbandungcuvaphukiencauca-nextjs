import { RowDataPacket } from 'mysql2';
interface WishlistItem extends RowDataPacket {
    id: number;
    user_id: number;
    product_id: number;
    created_at: Date;
    product_name?: string;
    price?: number;
    thumbnail_url?: string;
    stock_quantity?: number;
}
declare class WishlistRepository {
    /**
     * Thêm sản phẩm vào wishlist
     */
    addItem(userId: number, productId: number): Promise<number>;
    /**
     * Xóa sản phẩm khỏi wishlist
     */
    removeItem(userId: number, productId: number): Promise<boolean>;
    /**
     * Lấy danh sách wishlist của user
     */
    getByUser(userId: number): Promise<WishlistItem[]>;
    /**
     * Kiểm tra sản phẩm có trong wishlist không
     */
    isInWishlist(userId: number, productId: number): Promise<boolean>;
    /**
     * Xóa toàn bộ wishlist của user
     */
    clearUserWishlist(userId: number): Promise<boolean>;
    /**
     * Đếm số sản phẩm trong wishlist
     */
    countByUser(userId: number): Promise<number>;
}
declare const _default: WishlistRepository;
export default _default;
//# sourceMappingURL=wishlistRepositoryImpl.d.ts.map