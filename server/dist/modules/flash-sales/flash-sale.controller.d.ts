import { Request, Response, NextFunction } from 'express';
export declare class FlashSaleController {
    createFlashSale(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getActiveFlashSales(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllFlashSales(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFlashSaleById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateFlashSale(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    deleteFlashSale(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: FlashSaleController;
export default _default;
//# sourceMappingURL=flash-sale.controller.d.ts.map