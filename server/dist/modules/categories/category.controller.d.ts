import { Request, Response, NextFunction } from 'express';
export declare class CategoryController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const categoryController: CategoryController;
export default categoryController;
//# sourceMappingURL=category.controller.d.ts.map