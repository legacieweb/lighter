const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send order confirmation email to customer
async function sendOrderConfirmationEmail(order, userEmail) {
    try {
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span style="font-size: 20px; margin-right: 10px;">${item.emoji}</span>
                    ${item.name}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Order Confirmation - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #ff6b35, #ffb347); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔥 Lighter Pooa</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Order Confirmation</p>
                    </div>

                    <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order!</h2>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #ff6b35;">Order Details</h3>
                            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
                            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #4caf50; font-weight: bold;">${order.orderStatus}</span></p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                                    <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                                    <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                                    <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                                <tr style="background: #f8f9fa; font-weight: bold;">
                                    <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6;">Total Amount:</td>
                                    <td style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6; color: #ff6b35; font-size: 18px;">$${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #ff6b35;">Shipping Information</h3>
                            <p style="margin: 5px 0;">${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.street}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.email}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.phone}</p>
                        </div>

                        <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
                            <h3 style="margin: 0 0 10px 0; color: #2e7d32;">What's Next?</h3>
                            <p style="margin: 0; color: #388e3c;">
                                We'll process your order and send you shipping updates via email.
                                You can also track your order status in your dashboard.
                            </p>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #666; margin: 0;">
                                Questions? Contact us at <a href="mailto:info@lighterpooa.com" style="color: #ff6b35;">info@lighterpooa.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent to:', userEmail);
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
    }
}

// Send new order notification to admin
async function sendAdminOrderNotification(order) {
    try {
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">
                    <span style="font-size: 16px; margin-right: 8px;">${item.emoji}</span>
                    ${item.name}
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Order Received - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #ff6b35, #ffb347); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔥 New Order Alert</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Lighter Pooa Admin</p>
                    </div>

                    <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="margin: 0; color: #856404;">📦 New Order Received!</h3>
                        </div>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #ff6b35;">Order Details</h3>
                            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
                            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                            <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: #4caf50; font-weight: bold;">${order.paymentInfo.status}</span></p>
                            <p style="margin: 5px 0;"><strong>Order Status:</strong> <span style="color: #ff9800; font-weight: bold;">${order.orderStatus}</span></p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                                <tr style="background: #f8f9fa; font-weight: bold;">
                                    <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6;">Total Amount:</td>
                                    <td style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6; color: #ff6b35; font-size: 18px;">$${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h3 style="margin: 0 0 15px 0; color: #ff6b35;">Customer Information</h3>
                            <p style="margin: 5px 0;"><strong>Name:</strong> ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${order.shippingInfo.email}</p>
                            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingInfo.phone}</p>
                            <p style="margin: 5px 0;"><strong>Address:</strong> ${order.shippingInfo.street}, ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}</p>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/admin"
                               style="background: linear-gradient(135deg, #ff6b35, #ffb347); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                View in Admin Panel
                            </a>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Admin order notification sent for order:', order.orderNumber);
    } catch (error) {
        console.error('Failed to send admin order notification:', error);
    }
}

module.exports = {
    sendOrderConfirmationEmail,
    sendAdminOrderNotification
};