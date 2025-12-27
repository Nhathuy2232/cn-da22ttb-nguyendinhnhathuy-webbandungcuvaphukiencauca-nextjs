import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('fee')
  async getShippingFee(@Body() data: any) {
    return this.shippingService.getShippingFee(data);
  }

  @Get('provinces')
  async getProvinces() {
    return this.shippingService.getProvinces();
  }

  @Get('districts/:provinceId')
  async getDistricts(@Param('provinceId') provinceId: string) {
    return this.shippingService.getDistricts(+provinceId);
  }

  @Get('wards/:districtId')
  async getWards(@Param('districtId') districtId: string) {
    return this.shippingService.getWards(+districtId);
  }

  @Get('order/:orderCode')
  async getOrderStatus(@Param('orderCode') orderCode: string) {
    return this.shippingService.getOrderStatus(orderCode);
  }
}