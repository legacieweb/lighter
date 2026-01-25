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
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px; vertical-align: middle;">
                    <span style="font-size: 20px; margin-right: 10px;">${item.emoji}</span>
                    ${item.name}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Ksh ${item.price.toLocaleString()}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Ksh ${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Order Confirmation - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #ff6b35, #ffb347); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Blaze city</h1>
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
                                    <td style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6; color: #ff6b35; font-size: 18px;">Ksh ${order.totalAmount.toLocaleString()}</td>
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
                                Questions? Contact us at <a href="mailto:info@Blazecity.com" style="color: #ff6b35;">info@Blazecity.com</a>
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
                    <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-right: 8px; vertical-align: middle;">
                    <span style="font-size: 16px; margin-right: 8px;">${item.emoji}</span>
                    ${item.name}
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Ksh ${item.price.toLocaleString()}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Ksh ${(item.price * item.quantity).toLocaleString()}</td>
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
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Blaze city Admin</p>
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
                                    <td style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6; color: #ff6b35; font-size: 18px;">Ksh ${order.totalAmount.toLocaleString()}</td>
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

// Send order status update email to customer
async function sendOrderStatusUpdateEmail(order, userEmail) {
    try {
        const statusColors = {
            pending: '#ff9800',
            processing: '#2196f3',
            shipped: '#ffc107',
            delivered: '#4caf50',
            cancelled: '#f44336'
        };

        const statusText = {
            pending: 'Pending',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Order Status Updated - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #ff6b35, #ffb347); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Blaze city</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Order Status Update</p>
                    </div>

                    <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Your order status has been updated!</h2>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #ff6b35;">Order Details</h3>
                            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
                            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                            <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="color: ${statusColors[order.orderStatus]}; font-weight: bold;">${statusText[order.orderStatus]}</span></p>
                        </div>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #ff6b35;">Order Items</h3>
                            ${order.items.map(item => `
                                <p style="margin: 5px 0;">• <img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 3px; margin-right: 8px; vertical-align: middle;"><span style="font-size: 16px; margin-right: 8px;">${item.emoji}</span>${item.name} x ${item.quantity}</p>
                            `).join('')}
                        </div>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #ff6b35;">Shipping Information</h3>
                            <p style="margin: 5px 0;">${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.street}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.email}</p>
                            <p style="margin: 5px 0;">${order.shippingInfo.phone}</p>
                        </div>

                        <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
                            <h3 style="margin: 0 0 10px 0; color: #1565c0;">What's Next?</h3>
                            <p style="margin: 0; color: #1976d2;">
                                ${order.orderStatus === 'shipped' ? 'Your order is on the way! We\'ll notify you when it\'s delivered.' : 
                                  order.orderStatus === 'delivered' ? 'Your order has been delivered! Enjoy your purchase!' :
                                  order.orderStatus === 'cancelled' ? 'Your order has been cancelled. If you have any questions, please contact us.' :
                                  'Your order is being processed. We\'ll update you when it ships.'}
                            </p>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #666; margin: 0;">
                                Questions? Contact us at <a href="mailto:info@Blazecity.com" style="color: #ff6b35;">info@Blazecity.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order status update email sent to:', userEmail);
    } catch (error) {
        console.error('Failed to send order status update email:', error);
    }
}

module.exports = {
    sendOrderConfirmationEmail,
    sendAdminOrderNotification,
    sendOrderStatusUpdateEmail
};