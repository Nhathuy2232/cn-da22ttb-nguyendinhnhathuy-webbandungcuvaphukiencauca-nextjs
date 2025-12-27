/**
 * Index file - Export tất cả các repositories
 * Sử dụng để import dễ dàng hơn
 */
export { default as userRepository } from './userRepositoryImpl';
export { default as productRepository } from './productRepositoryImpl';
export { default as orderRepository } from './orderRepositoryImpl';
export { default as cartRepository } from './cartRepositoryImpl';
export { default as categoryRepository } from './categoryRepositoryImpl';
export { default as blogRepository } from './blogRepositoryImpl';
export { default as reviewRepository } from './reviewRepositoryImpl';
export { default as wishlistRepository } from './wishlistRepositoryImpl';
export { default as couponRepository } from './couponRepositoryImpl';
export { default as flashSaleRepository } from './flashSaleRepositoryImpl';
export type { UserRecord, UserRole } from './userRepositoryImpl';
export type { OrderRecord, OrderItemRecord, OrderWithItems } from './orderRepositoryImpl';
//# sourceMappingURL=index.d.ts.map