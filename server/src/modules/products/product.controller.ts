import { Request, Response, NextFunction } from 'express';
import productService from './product.service';

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, page = '1', limit = '20' } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const result = await productService.list({
        search: search as string,
        category: category as string,
        limit: limitNum,
        offset,
      });

      res.json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID sản phẩm không hợp lệ',
        });
      }
      const product = await productService.findById(parseInt(id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm',
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();
export default productController;
