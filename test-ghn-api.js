/**
 * =====================================================
 * GHN (GIAO HÀNG NHANH) API TEST FILE
 * =====================================================
 * 
 * File này chứa tất cả các API của Giao Hàng Nhanh được sử dụng trong dự án
 * Bao gồm: Master Data, Shipping Fee, Service, Lead Time, Create Order, Order Info, Cancel Order
 * 
 * Cách sử dụng:
 * 1. Cấu hình .env với GHN credentials
 * 2. Chạy: node test-ghn-api.js
 * 3. Chọn function muốn test
 */

require('dotenv').config({ path: './server/.env' });
const axios = require('axios');

// ==================== GHN CONFIGURATION ====================
const GHN_CONFIG = {
  baseUrl: process.env.GHN_API_URL || 'https://online-gateway.ghn.vn/shiip/public-api',
  token: process.env.GHN_TOKEN || '27b6a6da-d0f0-11f0-bcb9-a63866d22c8d',
  shopId: process.env.GHN_SHOP_ID || '5073856',
};

// Axios client cho GHN API
const ghnClient = axios.create({
  baseURL: GHN_CONFIG.baseUrl,
  headers: {
    'Token': GHN_CONFIG.token,
    'Content-Type': 'application/json'
  }
});

// ==================== MASTER DATA APIs ====================

/**
 * 1. Lấy danh sách tỉnh/thành phố
 * Endpoint: GET /shiip/public-api/master-data/province
 */
async function getProvinces() {
  try {
    console.log('\n📍 [GET PROVINCES] Đang lấy danh sách tỉnh/thành phố...');
    
    const response = await ghnClient.get('/shiip/public-api/master-data/province');
    
    console.log('✅ Thành công!');
    console.log(`📊 Tổng số tỉnh/thành: ${response.data.data.length}`);
    console.log('📋 Danh sách 5 tỉnh/thành đầu tiên:');
    response.data.data.slice(0, 5).forEach(province => {
      console.log(`   - [${province.ProvinceID}] ${province.ProvinceName}`);
    });
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 2. Lấy danh sách quận/huyện theo tỉnh
 * Endpoint: GET /shiip/public-api/master-data/district
 * @param {number} provinceId - ID của tỉnh/thành phố
 */
async function getDistricts(provinceId) {
  try {
    console.log(`\n📍 [GET DISTRICTS] Đang lấy danh sách quận/huyện của tỉnh ${provinceId}...`);
    
    const response = await ghnClient.get('/shiip/public-api/master-data/district', {
      params: { province_id: provinceId }
    });
    
    console.log('✅ Thành công!');
    console.log(`📊 Tổng số quận/huyện: ${response.data.data.length}`);
    console.log('📋 Danh sách 5 quận/huyện đầu tiên:');
    response.data.data.slice(0, 5).forEach(district => {
      console.log(`   - [${district.DistrictID}] ${district.DistrictName}`);
    });
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 3. Lấy danh sách phường/xã theo quận/huyện
 * Endpoint: GET /shiip/public-api/master-data/ward
 * @param {number} districtId - ID của quận/huyện
 */
async function getWards(districtId) {
  try {
    console.log(`\n📍 [GET WARDS] Đang lấy danh sách phường/xã của quận ${districtId}...`);
    
    const response = await ghnClient.get('/shiip/public-api/master-data/ward', {
      params: { district_id: districtId }
    });
    
    console.log('✅ Thành công!');
    console.log(`📊 Tổng số phường/xã: ${response.data.data.length}`);
    console.log('📋 Danh sách 5 phường/xã đầu tiên:');
    response.data.data.slice(0, 5).forEach(ward => {
      console.log(`   - [${ward.WardCode}] ${ward.WardName}`);
    });
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

// ==================== SHIPPING SERVICE APIs ====================

/**
 * 4. Lấy danh sách dịch vụ vận chuyển khả dụng
 * Endpoint: POST /shiip/public-api/v2/shipping-order/available-services
 * @param {number} fromDistrict - ID quận/huyện gửi hàng
 * @param {number} toDistrict - ID quận/huyện nhận hàng
 */
async function getAvailableServices(fromDistrict, toDistrict) {
  try {
    console.log('\n🚚 [GET SERVICES] Đang lấy danh sách dịch vụ vận chuyển...');
    console.log(`   Từ quận: ${fromDistrict} → Đến quận: ${toDistrict}`);
    
    const requestData = {
      shop_id: parseInt(GHN_CONFIG.shopId),
      from_district: fromDistrict,
      to_district: toDistrict
    };

    const response = await ghnClient.post(
      '/shiip/public-api/v2/shipping-order/available-services',
      requestData,
      {
        headers: { 'ShopId': GHN_CONFIG.shopId }
      }
    );
    
    console.log('✅ Thành công!');
    console.log(`📊 Số dịch vụ khả dụng: ${response.data.data.length}`);
    response.data.data.forEach(service => {
      console.log(`   - [${service.service_id}] ${service.short_name}: ${service.service_type_id}`);
    });
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 5. Tính phí vận chuyển
 * Endpoint: POST /shiip/public-api/v2/shipping-order/fee
 */
async function calculateShippingFee(params) {
  try {
    console.log('\n💰 [CALCULATE FEE] Đang tính phí vận chuyển...');
    
    const requestData = {
      service_id: params.serviceId || 53320,
      service_type_id: params.serviceTypeId || 2,
      to_district_id: params.toDistrictId,
      to_ward_code: params.toWardCode,
      height: params.height || 15,
      length: params.length || 15,
      weight: params.weight || 1000,
      width: params.width || 15,
      insurance_value: params.insuranceValue || 0,
      cod_failed_amount: params.codFailedAmount || 0,
      coupon: params.coupon || null
    };

    console.log('📦 Thông tin gói hàng:');
    console.log(`   - Kích thước: ${requestData.length}x${requestData.width}x${requestData.height} cm`);
    console.log(`   - Cân nặng: ${requestData.weight}g`);
    console.log(`   - Đến: District ${requestData.to_district_id}, Ward ${requestData.to_ward_code}`);

    const response = await ghnClient.post(
      '/shiip/public-api/v2/shipping-order/fee',
      requestData,
      {
        headers: { 'ShopId': GHN_CONFIG.shopId }
      }
    );
    
    console.log('✅ Thành công!');
    console.log('💵 Chi phí:');
    console.log(`   - Phí vận chuyển: ${response.data.data.total.toLocaleString('vi-VN')} VNĐ`);
    console.log(`   - Phí dịch vụ: ${response.data.data.service_fee.toLocaleString('vi-VN')} VNĐ`);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 6. Lấy thời gian dự kiến giao hàng
 * Endpoint: POST /shiip/public-api/v2/shipping-order/leadtime
 */
async function getLeadTime(params) {
  try {
    console.log('\n⏰ [GET LEAD TIME] Đang lấy thời gian dự kiến giao hàng...');
    
    const requestData = {
      from_district_id: params.fromDistrictId,
      from_ward_code: params.fromWardCode,
      to_district_id: params.toDistrictId,
      to_ward_code: params.toWardCode,
      service_id: params.serviceId
    };

    const response = await ghnClient.post(
      '/shiip/public-api/v2/shipping-order/leadtime',
      requestData,
      {
        headers: { 'ShopId': GHN_CONFIG.shopId }
      }
    );
    
    console.log('✅ Thành công!');
    console.log(`📅 Thời gian dự kiến: ${new Date(response.data.data.leadtime * 1000).toLocaleString('vi-VN')}`);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

// ==================== ORDER MANAGEMENT APIs ====================

/**
 * 7. Tạo đơn hàng vận chuyển
 * Endpoint: POST /shiip/public-api/v2/shipping-order/create
 */
async function createShippingOrder(orderData) {
  try {
    console.log('\n📦 [CREATE ORDER] Đang tạo đơn hàng vận chuyển...');
    
    const requestData = {
      payment_type_id: orderData.paymentTypeId || 2, // 1: Shop/Người bán, 2: Người mua/COD
      note: orderData.note || '',
      required_note: orderData.requiredNote || 'KHONGCHOXEMHANG', // CHOTHUHANG, CHOXEMHANGKHONGTHU, KHONGCHOXEMHANG
      
      // Thông tin người gửi
      from_name: orderData.fromName || 'Fishing Shop',
      from_phone: orderData.fromPhone || '0999999999',
      from_address: orderData.fromAddress || 'Trà Vinh',
      from_ward_name: orderData.fromWardName || 'Phường 6',
      from_district_name: orderData.fromDistrictName || 'Thành phố Trà Vinh',
      from_province_name: orderData.fromProvinceName || 'Trà Vinh',
      
      // Thông tin người nhận
      to_name: orderData.toName,
      to_phone: orderData.toPhone,
      to_address: orderData.toAddress,
      to_ward_code: orderData.toWardCode,
      to_district_id: orderData.toDistrictId,
      
      // Thông tin đơn hàng
      cod_amount: orderData.codAmount || 0,
      content: orderData.content || 'Dụng cụ câu cá',
      weight: orderData.weight || 500,
      length: orderData.length || 15,
      width: orderData.width || 15,
      height: orderData.height || 10,
      
      // Thông tin dịch vụ
      service_id: orderData.serviceId || 53320,
      service_type_id: orderData.serviceTypeId || 2,
      insurance_value: orderData.insuranceValue || 0,
      
      // Thông tin khác
      pick_station_id: orderData.pickStationId || null,
      deliver_station_id: orderData.deliverStationId || null,
      coupon: orderData.coupon || null,
      pick_shift: orderData.pickShift || [2],
      items: orderData.items || []
    };

    console.log('📋 Thông tin đơn hàng:');
    console.log(`   Người gửi: ${requestData.from_name} - ${requestData.from_phone}`);
    console.log(`   Người nhận: ${requestData.to_name} - ${requestData.to_phone}`);
    console.log(`   COD: ${requestData.cod_amount.toLocaleString('vi-VN')} VNĐ`);

    const response = await ghnClient.post(
      '/shiip/public-api/v2/shipping-order/create',
      requestData,
      {
        headers: { 'ShopId': GHN_CONFIG.shopId }
      }
    );
    
    console.log('✅ Tạo đơn hàng thành công!');
    console.log(`📝 Mã vận đơn: ${response.data.data.order_code}`);
    console.log(`🏷️  Mã sắp xếp: ${response.data.data.sort_code}`);
    console.log(`💰 Tổng phí: ${response.data.data.total_fee.toLocaleString('vi-VN')} VNĐ`);
    console.log(`📅 Dự kiến giao: ${new Date(response.data.data.expected_delivery_time).toLocaleString('vi-VN')}`);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi tạo đơn hàng:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 8. Lấy thông tin đơn hàng
 * Endpoint: GET /shiip/public-api/v2/shipping-order/detail
 */
async function getOrderInfo(orderCode) {
  try {
    console.log(`\n🔍 [GET ORDER INFO] Đang lấy thông tin đơn hàng ${orderCode}...`);
    
    const response = await ghnClient.get('/shiip/public-api/v2/shipping-order/detail', {
      params: { order_code: orderCode },
      headers: { 'ShopId': GHN_CONFIG.shopId }
    });
    
    const order = response.data.data;
    console.log('✅ Thành công!');
    console.log('📋 Thông tin đơn hàng:');
    console.log(`   - Mã vận đơn: ${order.order_code}`);
    console.log(`   - Trạng thái: ${order.status}`);
    console.log(`   - Người nhận: ${order.to_name} - ${order.to_phone}`);
    console.log(`   - Địa chỉ: ${order.to_address}`);
    console.log(`   - COD: ${order.cod_amount?.toLocaleString('vi-VN')} VNĐ`);
    console.log(`   - Phí ship: ${order.total_fee?.toLocaleString('vi-VN')} VNĐ`);
    
    return order;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 9. Hủy đơn hàng
 * Endpoint: POST /shiip/public-api/v2/switching-status/cancel
 */
async function cancelOrder(orderCodes) {
  try {
    console.log('\n🚫 [CANCEL ORDER] Đang hủy đơn hàng...');
    console.log(`   Mã đơn: ${orderCodes.join(', ')}`);
    
    const requestData = {
      order_codes: orderCodes
    };

    const response = await ghnClient.post(
      '/shiip/public-api/v2/switching-status/cancel',
      requestData,
      {
        headers: { 'ShopId': GHN_CONFIG.shopId }
      }
    );
    
    console.log('✅ Hủy đơn hàng thành công!');
    console.log('📋 Kết quả:', response.data.data);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    return null;
  }
}

// ==================== TEST SCENARIOS ====================

/**
 * Test Scenario 1: Lấy địa chỉ từ Trà Vinh
 */
async function testGetAddressData() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST SCENARIO 1: LẤY DỮ LIỆU ĐỊA CHỈ');
  console.log('='.repeat(60));
  
  // Lấy danh sách tỉnh
  const provinces = await getProvinces();
  
  if (provinces && provinces.length > 0) {
    // Tìm Trà Vinh
    const traVinh = provinces.find(p => p.ProvinceName.includes('Trà Vinh'));
    
    if (traVinh) {
      console.log(`\n✅ Tìm thấy Trà Vinh: [${traVinh.ProvinceID}] ${traVinh.ProvinceName}`);
      
      // Lấy quận/huyện của Trà Vinh
      const districts = await getDistricts(traVinh.ProvinceID);
      
      if (districts && districts.length > 0) {
        // Tìm Thành phố Trà Vinh
        const tpTraVinh = districts.find(d => d.DistrictName.includes('Thành phố'));
        
        if (tpTraVinh) {
          console.log(`\n✅ Tìm thấy Thành phố Trà Vinh: [${tpTraVinh.DistrictID}]`);
          // Lấy phường/xã
          await getWards(tpTraVinh.DistrictID);
        }
      }
    }
  }
}

/**
 * Test Scenario 2: Tính phí vận chuyển từ Trà Vinh đến TP.HCM
 */
async function testCalculateShippingFee() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST SCENARIO 2: TÍNH PHÍ VẬN CHUYỂN');
  console.log('='.repeat(60));
  
  // Thành phố Trà Vinh (1560) → Quận 1, HCM (1442)
  const services = await getAvailableServices(1560, 1442);
  
  if (services && services.length > 0) {
    const service = services[0];
    
    console.log(`\n📌 Sử dụng dịch vụ: [${service.service_id}] ${service.short_name}`);
    
    await calculateShippingFee({
      serviceId: service.service_id,
      serviceTypeId: service.service_type_id,
      toDistrictId: 1442, // Quận 1, HCM
      toWardCode: '20101', // Phường Bến Nghé
      weight: 500,
      length: 15,
      width: 15,
      height: 10,
      insuranceValue: 1000000
    });
  }
}

/**
 * Test Scenario 3: Tạo đơn hàng test - Gửi dụng cụ câu cá từ Trà Vinh đến HCM
 */
async function testCreateOrder() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST SCENARIO 3: TẠO ĐƠN HÀNG TEST');
  console.log('='.repeat(60));
  
  const orderData = {
    // Thông tin người gửi (Fishing Shop tại Trà Vinh)
    fromName: 'Fishing Shop',
    fromPhone: '0999999999',
    fromAddress: 'Trà Vinh',
    fromWardCode: '580106', // Phường 6
    fromDistrictId: 1560, // Thành phố Trà Vinh
    
    // Thông tin người nhận (Khách ở HCM)
    toName: 'Nguyễn Văn A',
    toPhone: '0987654321',
    toAddress: '123 Nguyễn Huệ, Quận 1',
    toWardCode: '20101', // Phường Bến Nghé
    toDistrictId: 1442, // Quận 1, HCM
    
    // Thông tin đơn hàng
    codAmount: 1500000,
    content: 'Cần câu shimano',
    weight: 500,
    
    // Dịch vụ
    serviceTypeId: 2,
    requiredNote: 'CHOXEMHANGKHONGTHU',
    
    // Items
    items: [
      {
        name: 'Cần câu Shimano FX 2.1m',
        quantity: 1,
        price: 1500000
      }
    ]
  };
  
  await createShippingOrder(orderData);
}

/**
 * Test Scenario 4: Kiểm tra thông tin đơn hàng
 */
async function testGetOrderInfo() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST SCENARIO 4: KIỂM TRA THÔNG TIN ĐƠN HÀNG');
  console.log('='.repeat(60));
  
  // Thay YOUR_ORDER_CODE bằng mã vận đơn thực tế
  await getOrderInfo('LK4B73');
}

// ==================== MAIN MENU ====================

async function showMenu() {
  console.log('\n' + '='.repeat(60));
  console.log('🚚 GHN API TEST MENU');
  console.log('='.repeat(60));
  console.log('\n📌 GHN Configuration:');
  console.log(`   Base URL: ${GHN_CONFIG.baseUrl}`);
  console.log(`   Token: ${GHN_CONFIG.token.substring(0, 10)}...`);
  console.log(`   Shop ID: ${GHN_CONFIG.shopId}`);
  console.log('\n📋 Available Tests:');
  console.log('   1. Test Scenario 1: Lấy dữ liệu địa chỉ (Tỉnh → Quận → Phường)');
  console.log('   2. Test Scenario 2: Tính phí vận chuyển');
  console.log('   3. Test Scenario 3: Tạo đơn hàng test');
  console.log('   4. Test Scenario 4: Kiểm tra thông tin đơn hàng');
  console.log('   5. Test All: Chạy tất cả test scenarios');
  console.log('\n📚 Individual Functions:');
  console.log('   a. Get Provinces');
  console.log('   b. Get Districts (Trà Vinh)');
  console.log('   c. Get Wards (Thành phố Trà Vinh)');
  console.log('   d. Get Available Services (Trà Vinh → HCM)');
  console.log('   e. Calculate Shipping Fee (Trà Vinh → HCM)');
  console.log('   f. Get Lead Time');
  console.log('\n   0. Exit');
  console.log('='.repeat(60));
}

async function runTest(choice) {
  switch (choice) {
    case '1':
      await testGetAddressData();
      break;
    case '2':
      await testCalculateShippingFee();
      break;
    case '3':
      await testCreateOrder();
      break;
    case '4':
      await testGetOrderInfo();
      break;
    case '5':
      await testGetAddressData();
      await testCalculateShippingFee();
      await testCreateOrder();
      await testGetOrderInfo();
      break;
    case 'a':
      await getProvinces();
      break;
    case 'b':
      await getDistricts(214); // Trà Vinh Province ID
      break;
    case 'c':
      await getWards(1560); // Thành phố Trà Vinh District ID
      break;
    case 'd':
      await getAvailableServices(1560, 1442); // Trà Vinh → HCM
      break;
    case 'e':
      await calculateShippingFee({
        toDistrictId: 1442,
        toWardCode: '20101'
      });
      break;
    case 'f':
      await getLeadTime({
        fromDistrictId: 1560,
        fromWardCode: '580106',
        toDistrictId: 1442,
        toWardCode: '20101',
        serviceId: 53320
      });
      break;
    default:
      console.log('❌ Lựa chọn không hợp lệ!');
  }
}

// ==================== RUN ====================

async function main() {
  // Kiểm tra cấu hình
  if (GHN_CONFIG.token === 'your-ghn-token-here' || GHN_CONFIG.shopId === 'your-shop-id-here') {
    console.log('\n⚠️  CẢNH BÁO: Chưa cấu hình GHN credentials!');
    console.log('📝 Vui lòng cập nhật file .env với:');
    console.log('   GHN_TOKEN=your_token_here');
    console.log('   GHN_SHOP_ID=your_shop_id_here');
    console.log('\n💡 Hoặc chỉnh sửa trực tiếp trong file này (GHN_CONFIG)\n');
  }

  await showMenu();
  
  // Tự động chạy test scenario 1 nếu không có tham số
  const args = process.argv.slice(2);
  if (args.length > 0) {
    await runTest(args[0]);
  } else {
    console.log('\n💡 Cách sử dụng:');
    console.log('   node test-ghn-api.js [số/chữ]');
    console.log('   Ví dụ: node test-ghn-api.js 1');
    console.log('   Hoặc: node test-ghn-api.js a');
    console.log('\n🚀 Chạy test scenario 1 mặc định...');
    await testGetAddressData();
  }
}

// Chạy main function
if (require.main === module) {
  main().catch(console.error);
}

// ==================== EXPORTS ====================

module.exports = {
  // Master Data
  getProvinces,
  getDistricts,
  getWards,
  
  // Shipping Services
  getAvailableServices,
  calculateShippingFee,
  getLeadTime,
  
  // Order Management
  createShippingOrder,
  getOrderInfo,
  cancelOrder,
  
  // Test Scenarios
  testGetAddressData,
  testCalculateShippingFee,
  testCreateOrder,
  testGetOrderInfo
};
