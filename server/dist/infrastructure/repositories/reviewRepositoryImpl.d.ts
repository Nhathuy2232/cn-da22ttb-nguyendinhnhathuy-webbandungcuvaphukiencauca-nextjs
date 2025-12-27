import { RowDataPacket } from 'mysql2';
interface Review extends RowDataPacket {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
    user_name?: string;
}
interface ReviewStats extends RowDataPacket {
    average_rating: number;
    total_reviews: number;
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
}
declare class ReviewRepository {
    /**
     * Tạo đánh giá mới
     */
    create(data: {
        productId: number;
        userId: number;
        rating: number;
        comment?: string;
    }): Promise<Review>;
    /**
     * Cập nhật đánh giá
     */
    update(id: number, userId: number, data: {
        rating?: number;
        comment?: string;
    }): Promise<boolean>;
    /**
     * Xóa đánh giá
     */
    delete(id: number, userId: number): Promise<boolean>;
    /**
     * Lấy danh sách đánh giá của sản phẩm
     */
    getByProduct(productId: number, limit?: number, offset?: number): Promise<Review[]>;
    /**
     * Lấy thống kê đánh giá của sản phẩm
     */
    getProductStats(productId: number): Promise<ReviewStats>;
    /**
     * Kiểm tra user đã review sản phẩm chưa
     */
    hasUserReviewed(userId: number, productId: number): Promise<boolean>;
    /**
     * Lấy đánh giá của user cho sản phẩm
     */
    getUserReview(userId: number, productId: number): Promise<Review | null>;
    /**
     * Lấy tất cả đánh giá của user
     */
    getByUser(userId: number): Promise<Review[]>;
}
declare const _default: ReviewRepository;
export default _default;
//# sourceMappingURL=reviewRepositoryImpl.d.ts.map