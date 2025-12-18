import { Request, Response, NextFunction } from 'express';
import categoryService from './category.service';

export class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.list();
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoryService.findById(parseInt(id));

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy danh mục',
        });
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}

const categoryController = new CategoryController();
export default categoryController;
