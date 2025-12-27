"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    transporter = null;
    constructor() {
        this.initializeTransporter();
    }
    initializeTransporter() {
        try {
            const emailHost = process.env.EMAIL_HOST;
            const emailPort = parseInt(process.env.EMAIL_PORT || '587');
            const emailUser = process.env.EMAIL_USER;
            const emailPassword = process.env.EMAIL_PASSWORD;
            if (!emailHost || !emailUser || !emailPassword) {
                console.warn('⚠️ Email configuration is incomplete. Email sending will be disabled.');
                return;
            }
            this.transporter = nodemailer_1.default.createTransport({
                host: emailHost,
                port: emailPort,
                secure: emailPort === 465, // true for 465, false for other ports
                auth: {
                    user: emailUser,
                    pass: emailPassword,
                },
            });
            console.log('✅ Email service initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize email service:', error);
        }
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    }
    formatDate(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }
    getPaymentMethodText(method) {
        const methods = {
            cod: 'Thanh toán khi nhận hàng (COD)',
            bank_transfer: 'Chuyển khoản ngân hàng',
            e_wallet: 'Ví điện tử',
        };
        return methods[method] || method;
    }
    generateOrderEmailHTML(data, isAdmin = false) {
        const itemsHTML = data.items
            .map((item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${this.formatCurrency(item.price)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${this.formatCurrency(item.price * item.quantity)}</td>
        </tr>
      `)
            .join('');
        const ghnSection = data.ghnOrderCode
            ? `
      <tr>
        <td style="padding: 5px 0; font-weight: bold;">Mã vận đơn GHN:</td>
        <td style="padding: 5px 0;">${data.ghnOrderCode}</td>
      </tr>
    `
            : '';
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isAdmin ? 'Đơn hàng mới' : 'Xác nhận đơn hàng'}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isAdmin ? '🔔 Đơn hàng mới' : '✅ Xác nhận đơn hàng'}
          </h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            ${isAdmin ? `Có đơn hàng mới từ khách hàng <strong>${data.customerName}</strong>` : `Xin chào <strong>${data.customerName}</strong>,`}
          </p>
          
          ${isAdmin ? '' : '<p>Cảm ơn bạn đã đặt hàng tại Fishing Shop! Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>'}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">Thông tin đơn hàng</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Mã đơn hàng:</td>
                <td style="padding: 5px 0;">#${data.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Ngày đặt:</td>
                <td style="padding: 5px 0;">${this.formatDate(data.orderDate)}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Phương thức thanh toán:</td>
                <td style="padding: 5px 0;">${this.getPaymentMethodText(data.paymentMethod)}</td>
              </tr>
              ${ghnSection}
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">Chi tiết sản phẩm</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Sản phẩm</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">SL</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Đơn giá</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0;">Tạm tính:</td>
                <td style="padding: 5px 0; text-align: right;">${this.formatCurrency(data.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Phí vận chuyển:</td>
                <td style="padding: 5px 0; text-align: right;">${this.formatCurrency(data.shippingFee)}</td>
              </tr>
              <tr style="border-top: 2px solid #667eea;">
                <td style="padding: 10px 0; font-size: 18px; font-weight: bold; color: #667eea;">Tổng cộng:</td>
                <td style="padding: 10px 0; font-size: 18px; font-weight: bold; text-align: right; color: #667eea;">${this.formatCurrency(data.total)}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">Địa chỉ giao hàng</h2>
            <p style="margin: 0;">${data.shippingAddress}</p>
          </div>

          ${isAdmin
            ? ''
            : `
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao cho đơn vị vận chuyển.</p>
            <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
          </div>
          `}

          <div style="border-top: 2px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p><strong>Fishing Shop</strong></p>
            <p>Địa chỉ: Trà Vinh, Việt Nam</p>
            <p>Email: support@fishingshop.com | Hotline: 0376 911 677</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    async sendNewOrderNotificationToAdmin(data) {
        if (!this.transporter) {
            console.log('📧 Email service is not configured. Skipping admin notification.');
            return;
        }
        try {
            const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
            const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
            if (!adminEmail) {
                console.warn('⚠️ Admin email is not configured');
                return;
            }
            const emailHTML = this.generateOrderEmailHTML(data, true);
            const mailOptions = {
                from: fromEmail,
                to: adminEmail,
                subject: `🔔 Đơn hàng mới #${data.orderNumber} - ${data.customerName}`,
                html: emailHTML,
                text: `Đơn hàng mới #${data.orderNumber}\n\nKhách hàng: ${data.customerName}\nEmail: ${data.customerEmail}\nSĐT: ${data.customerPhone}\nTổng tiền: ${this.formatCurrency(data.total)}`,
            };
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Admin notification email sent for order #${data.orderNumber}`);
        }
        catch (error) {
            console.error('❌ Failed to send admin notification email:', error);
            throw error;
        }
    }
    async sendOrderConfirmationToCustomer(data) {
        if (!this.transporter) {
            console.log('📧 Email service is not configured. Skipping customer confirmation.');
            return;
        }
        try {
            const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
            const emailHTML = this.generateOrderEmailHTML(data, false);
            const mailOptions = {
                from: fromEmail,
                to: data.customerEmail,
                subject: `✅ Xác nhận đơn hàng #${data.orderNumber} - Fishing Shop`,
                html: emailHTML,
                text: `Xác nhận đơn hàng #${data.orderNumber}\n\nXin chào ${data.customerName},\n\nĐơn hàng của bạn đã được tiếp nhận.\nTổng tiền: ${this.formatCurrency(data.total)}\n\nCảm ơn bạn đã mua hàng!`,
            };
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Confirmation email sent to ${data.customerEmail} for order #${data.orderNumber}`);
        }
        catch (error) {
            console.error('❌ Failed to send customer confirmation email:', error);
            throw error;
        }
    }
}
const emailService = new EmailService();
exports.default = emailService;
//# sourceMappingURL=emailService.js.map