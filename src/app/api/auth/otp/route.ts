import { NextRequest, NextResponse } from 'next/server';
import { requestOtp, verifyOtp } from '@/lib/auth';
import { checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || 'client-auth';
    const body = await req.json();
    const { action, phone, otp, token } = body;

    if (action === 'request') {
      if (!phone) {
        return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
      }

      // Allow testing without blocking
      const rateCheck = checkRateLimit(`otp-req-${clientIp}-${phone}`, 15, 600000);
      if (!rateCheck.allowed) {
        return NextResponse.json({
          success: false,
          message: `Too many OTP requests. Please wait ${Math.ceil(rateCheck.resetInSeconds / 60)} minutes before trying again.`
        }, { status: 429 });
      }

      const result = requestOtp(phone);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'verify') {
      if (!phone || !otp) {
        return NextResponse.json({ success: false, message: 'Phone and OTP are required' }, { status: 400 });
      }

      const result = verifyOtp(phone, otp, token);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
