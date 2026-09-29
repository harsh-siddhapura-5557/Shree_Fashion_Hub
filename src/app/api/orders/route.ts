import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus } from '@/lib/db';
import { sendOrderNotifications } from '@/lib/email';
import { sendOrderSmsNotification } from '@/lib/sms';
import { verifyAdminAuth, sanitizeString, isValidEmail, isValidPincode, checkRateLimit } from '@/lib/security';
import { isValidIndianPhone } from '@/lib/auth';
import { Order, OrderItem } from '@/types';

export async function GET(req: NextRequest) {
  try {
    // Sensitive customer order list requires Admin Authorization
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Admin credentials required to access customer orders.'
      }, { status: 401 });
    }

    const orders = getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to retrieve orders', error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limit to prevent spam orders (max 5 orders per 3 minutes per client)
    const clientIp = req.headers.get('x-forwarded-for') || 'customer-client';
    const rateCheck = checkRateLimit(`order-${clientIp}`, 5, 180000);
    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        message: `Order rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`
      }, { status: 429 });
    }

    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      state,
      pincode,
      items,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      unboxingPolicyAccepted
    } = body;

    // 2. Validate essential fields
    if (!customerName || !customerPhone || !shippingAddress || !pincode || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Missing required order fields.' }, { status: 400 });
    }

    // 3. Validate Unboxing Video policy agreement
    if (!unboxingPolicyAccepted) {
      return NextResponse.json({
        success: false,
        message: 'You must acknowledge the unboxing video return policy to place an order.'
      }, { status: 400 });
    }

    // 4. Strict Indian Phone Validation
    if (!isValidIndianPhone(customerPhone)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number.'
      }, { status: 400 });
    }

    // 5. Strict Email validation if provided
    const cleanEmail = sanitizeString(customerEmail) || 'customer@shreefashionhub.com';
    if (customerEmail && !isValidEmail(customerEmail)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address.'
      }, { status: 400 });
    }

    // 6. Strict Pincode validation
    const cleanPincode = sanitizeString(pincode);
    if (!isValidPincode(cleanPincode)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid 6-digit Indian PIN code.'
      }, { status: 400 });
    }

    // 7. Sanitize inputs
    const sanitizedName = sanitizeString(customerName);
    const sanitizedAddress = sanitizeString(shippingAddress);
    const sanitizedCity = sanitizeString(city) || 'Ahmedabad';
    const sanitizedState = sanitizeString(state) || 'Gujarat';

    // 8. Validate items & compute secure total
    let calculatedSubtotal = 0;
    const sanitizedItems: OrderItem[] = [];

    for (const it of items) {
      const qty = Math.max(1, Math.min(10, Number(it.quantity || 1)));
      const price = Math.max(0, Number(it.price || 0));
      calculatedSubtotal += price * qty;

      sanitizedItems.push({
        productId: sanitizeString(it.productId),
        title: sanitizeString(it.title),
        size: sanitizeString(it.size),
        colorName: sanitizeString(it.colorName),
        colorHex: sanitizeString(it.colorHex),
        quantity: qty,
        price,
        image: sanitizeString(it.image)
      });
    }

    const newOrder = createOrder({
      customerName: sanitizedName,
      customerPhone: sanitizeString(customerPhone),
      customerEmail: cleanEmail,
      shippingAddress: sanitizedAddress,
      city: sanitizedCity,
      state: sanitizedState,
      pincode: cleanPincode,
      items: sanitizedItems,
      subtotal: calculatedSubtotal,
      shippingFee: 0, // All India Free Shipping
      totalAmount: calculatedSubtotal,
      paymentMethod: paymentMethod === 'UPI / Online' ? 'UPI / Online' : 'COD',
      upiTransactionId: paymentMethod === 'UPI / Online' && body.upiTransactionId ? sanitizeString(body.upiTransactionId) : undefined,
      status: 'Confirmed',
      unboxingPolicyAccepted: true
    });

    // Fire notifications to both Customer and Admin securely
    try {
      await sendOrderNotifications(newOrder);
    } catch (notificationError) {
      console.error('Email dispatch note:', notificationError);
    }

    try {
      await sendOrderSmsNotification(
        newOrder.customerPhone,
        newOrder.orderNumber,
        newOrder.totalAmount,
        newOrder.customerName
      );
    } catch (smsError) {
      console.error('SMS dispatch note:', smsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed securely! Notifications sent to customer and admin.',
      order: newOrder
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create order securely', error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // 1. Verify Admin Authorization to update order statuses
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Admin credentials required to modify orders.'
      }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: 'orderId and status are required' }, { status: 400 });
    }

    const validStatuses: Order['status'][] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid order status specified.' }, { status: 400 });
    }

    const updated = updateOrderStatus(orderId, status as Order['status']);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update order status', error: String(error) }, { status: 500 });
  }
}
