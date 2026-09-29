import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { Order } from '@/types';

// Configure transporter using env variables or fallback
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || 'localworkuse24@gmail.com';
  const pass = process.env.SMTP_PASS || 'qqhrwpjixbhpzwzy';

  if (user && pass) {
    if (host.includes('gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
    }
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Fallback to test/console transport
  return null;
}

export async function sendOrderNotifications(order: Order) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'harshsiddhapura5557@gmail.com';
  const fromEmail = process.env.SMTP_FROM || '"Shree Fashion Hub" <localworkuse24@gmail.com>';

  const itemsHtml = order.items
    .map(
      item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px; vertical-align: top;">
          <img src="${item.image}" alt="${item.title}" width="60" height="75" style="border-radius: 6px; object-fit: cover; display: block;" />
        </td>
        <td style="padding: 12px 8px; vertical-align: top;">
          <strong style="color: #0b132b; font-size: 14px;">${item.title}</strong><br/>
          <span style="color: #64748b; font-size: 13px;">Size: <strong>${item.size}</strong> | Color: <strong>${item.colorName}</strong></span><br/>
          <span style="color: #64748b; font-size: 13px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 8px; vertical-align: top; text-align: right; font-weight: 600; color: #0b132b;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  // 1. Customer Email Template
  const customerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Shree Fashion Hub</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); padding: 36px 24px 28px 24px; text-align: center; color: #ffffff;">
          <div style="margin-bottom: 12px;">
            <img src="cid:sf_brand_logo" alt="Shree Fashion Hub Logo" width="72" height="72" style="width: 72px; height: 72px; border-radius: 16px; border: 2.5px solid #f59e0b; background: #ffffff; padding: 4px; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: inline-block; object-fit: contain;" />
          </div>
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800; color: #f59e0b;">SHREE FASHION HUB</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; letter-spacing: 1.5px; color: #cbd5e1;">PREMIUM DENIM & JEANS ARCHIVE</p>
        </div>

        <!-- Success Banner -->
        <div style="padding: 24px 24px 16px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
          <div style="display: inline-block; background-color: #ecfdf5; color: #059669; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 14px;">
            ✓ Order Confirmed #${order.orderNumber}
          </div>
          <p style="margin: 12px 0 0 0; color: #334155; font-size: 15px;">
            Thank you, <strong>${order.customerName}</strong>! We have received your order and our artisan denim team is preparing it for dispatch.
          </p>
        </div>

        <!-- Return Policy MANDATORY ALERT -->
        <div style="margin: 16px 24px; background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 14px 16px;">
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <strong style="color: #b45309; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">⚠️ Important Return Policy Notice</strong>
          </div>
          <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.45; font-weight: 600;">
            Note: Return valid only for damaged/defective pieces with a complete unboxing video from start to finish.
          </p>
        </div>

        <!-- Order Items -->
        <div style="padding: 16px 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #0b132b; text-transform: uppercase; letter-spacing: 0.5px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="margin-top: 16px; padding-top: 12px; border-top: 2px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; color: #64748b;">
              <span>Subtotal:</span>
              <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; color: #64748b;">
              <span>Shipping / Express Delivery:</span>
              <span style="color: #059669; font-weight: 600;">FREE</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 18px; font-weight: 800; color: #0b132b;">
              <span>Total Paid / Payable (${order.paymentMethod}):</span>
              <span style="color: #d97706;">₹${order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div style="background-color: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">Delivery Address</h4>
          <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.5;">
            <strong>${order.customerName}</strong><br/>
            ${order.shippingAddress}<br/>
            ${order.city}, ${order.state} - ${order.pincode}<br/>
            Contact Phone: <strong>${order.customerPhone}</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 24px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9;">
          <p style="margin: 0;">Shree Fashion Hub • Authentic Denim House</p>
          <p style="margin: 4px 0 0 0;">Need help? Reply directly to this email or reach us anytime.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  // 2. Admin Alert Email Template
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>New Order Alert</title></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f1f5f9; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 24px; border: 1px solid #cbd5e1;">
        <div style="border-bottom: 2px solid #0b132b; padding-bottom: 12px; margin-bottom: 16px;">
          <span style="background: #ef4444; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase;">NEW CUSTOMER ORDER</span>
          <h2 style="margin: 8px 0 0 0; color: #0b132b;">Order #${order.orderNumber} - ₹${order.totalAmount.toLocaleString('en-IN')}</h2>
        </div>

        <div style="background: #f8fafc; padding: 14px; border-radius: 6px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 6px 0; color: #334155;">Customer Details:</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.5;">
            Name: <strong>${order.customerName}</strong><br/>
            Phone: <a href="tel:${order.customerPhone}" style="color: #2563eb; font-weight: 700;">${order.customerPhone}</a><br/>
            Email: ${order.customerEmail}<br/>
            Address: ${order.shippingAddress}, ${order.city}, ${order.state} - ${order.pincode}<br/>
            Payment Mode: <strong>${order.paymentMethod}</strong>
          </p>
        </div>

        <h4 style="margin: 0 0 10px 0; color: #334155;">Ordered Items:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="text-align: center; margin-top: 20px;">
          <a href="/admin" style="background: #0b132b; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; display: inline-block;">
            Open Admin Dashboard
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const logoPath = path.join(process.cwd(), 'public', 'brand', 'sf-luxury-logo.png');
      const attachments = fs.existsSync(logoPath) ? [
        {
          filename: 'sf-luxury-logo.png',
          path: logoPath,
          cid: 'sf_brand_logo'
        }
      ] : [];

      // Send to Customer
      await transporter.sendMail({
        from: fromEmail,
        to: order.customerEmail,
        subject: `Your Shree Fashion Hub Order #${order.orderNumber} is Confirmed! 👖`,
        html: customerEmailHtml,
        attachments
      });

      // Send to Admin
      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `🚨 [New Order] #${order.orderNumber} by ${order.customerName} (₹${order.totalAmount})`,
        html: adminEmailHtml,
        attachments
      });
      return { success: true, delivered: true };
    } catch (err) {
      console.error('SMTP Delivery error:', err);
      // Fallback log
      return { success: true, delivered: false, error: String(err) };
    }
  } else {
    // Development mode logger
    console.log(`[EMAIL DISPATCH SIMULATOR]`);
    console.log(`[TO CUSTOMER: ${order.customerEmail}] Order #${order.orderNumber} confirmation dispatched.`);
    console.log(`[TO ADMIN: ${adminEmail}] Order #${order.orderNumber} alert dispatched.`);
    return { success: true, delivered: false, simulated: true };
  }
}

/**
 * Send branded, luxury OTP verification email to customer via Mailtrap / SMTP
 */
export async function sendOtpEmail(
  email: string, 
  otp: string, 
  customerName?: string
): Promise<{ success: boolean; delivered: boolean; error?: string }> {
  const fromEmail = process.env.SMTP_FROM || '"Shree Fashion Hub" <localworkuse24@gmail.com>';
  const name = customerName?.trim() || 'Valued Customer';

  const otpHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Verification Code - Shree Fashion Hub</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); padding: 36px 24px 28px 24px; text-align: center; color: #ffffff;">
          <div style="margin-bottom: 14px;">
            <img 
              src="cid:sf_brand_logo" 
              alt="Shree Fashion Hub" 
              width="80" 
              height="80" 
              style="width: 80px; height: 80px; border-radius: 20px; border: 2.5px solid #f59e0b; background: #ffffff; padding: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); display: inline-block; object-fit: contain;" 
            />
          </div>
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900; color: #f59e0b; font-family: 'Georgia', serif;">
            SHREE FASHION HUB
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 11px; opacity: 0.9; letter-spacing: 2.2px; text-transform: uppercase; color: #cbd5e1; font-weight: 600;">
            HANDCRAFTED DENIM &bull; EST. 2026
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px; text-align: center;">
          <div style="display: inline-block; background-color: #eff6ff; color: #1d4ed8; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-bottom: 16px;">
            🔐 Secure Account Verification
          </div>

          <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #0f172a; font-weight: 700;">
            Hello, ${name}
          </h2>
          <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
            Use the 6-digit verification code below to complete your login or registration at Shree Fashion Hub:
          </p>

          <!-- OTP Box -->
          <div style="background: #f8fafc; border: 2px dashed #0b132b; border-radius: 12px; padding: 20px 16px; margin: 0 auto 24px auto; max-width: 320px;">
            <span style="font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #0b132b; font-family: 'Courier New', Courier, monospace; display: block; padding-left: 10px;">
              ${otp}
            </span>
          </div>

          <p style="margin: 0 0 8px 0; color: #475569; font-size: 13px; font-weight: 500;">
            ⏱️ This OTP is valid for <strong>10 minutes</strong>.
          </p>
          <p style="margin: 0; color: #94a3b8; font-size: 12px;">
            If you did not request this verification code, please ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0; font-weight: 600; color: #64748b;">Shree Fashion Hub • Authentic Denim House</p>
        </div>

      </div>
    </body>
    </html>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const logoPath = path.join(process.cwd(), 'public', 'brand', 'sf-luxury-logo.png');
      const attachments = fs.existsSync(logoPath) ? [
        {
          filename: 'sf-luxury-logo.png',
          path: logoPath,
          cid: 'sf_brand_logo'
        }
      ] : [];

      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: `Your Verification Code: ${otp} - Shree Fashion Hub 👖`,
        html: otpHtml,
        attachments
      });
      console.log(`[EMAIL OTP DELIVERED via SMTP] To: ${email} | OTP: ${otp}`);
      return { success: true, delivered: true };
    } catch (err) {
      console.error('[SMTP OTP Error]', err);
      return { success: true, delivered: false, error: String(err) };
    }
  } else {
    console.log(`[EMAIL OTP SIMULATION] To: ${email} | Code: ${otp}`);
    return { success: true, delivered: false };
  }
}

