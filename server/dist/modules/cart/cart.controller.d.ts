import { Request, Response, NextFunction } from 'express';
export declare class CartController {
    getCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    addItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    removeItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    clearCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const cartController: CartController;
export default cartController;
//# sourceMappingURL=cart.controller.d.ts.map