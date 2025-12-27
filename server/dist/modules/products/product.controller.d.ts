import { Request, Response, NextFunction } from 'express';
export declare class ProductController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const productController: ProductController;
export default productController;
//# sourceMappingURL=product.controller.d.ts.map