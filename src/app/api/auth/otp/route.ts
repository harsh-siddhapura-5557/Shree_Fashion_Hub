import { NextRequest, NextResponse } from 'next/server';
import { requestOtp, verifyOtp } from '@/lib/auth';
import { checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || 'client-auth';
    const body = await req.json();
    const { action, phone, otp } = body;

    if (action === 'request') {
      if (!phone) {
        return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
      }

      // Limit max 4 OTP requests per 10 minutes per IP/Phone to prevent SMS spamming / harassment
      const rateCheck = checkRateLimit(`otp-req-${clientIp}-${phone}`, 4, 600000);
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

      // Limit max 6 verify attempts per 5 minutes per IP to prevent brute force
      const verifyRate = checkRateLimit(`otp-ver-${clientIp}-${phone}`, 6, 300000);
      if (!verifyRate.allowed) {
        return NextResponse.json({
          success: false,
          message: `Too many failed attempts. Please wait ${verifyRate.resetInSeconds} seconds before retrying.`
        }, { status: 429 });
      }

      const result = verifyOtp(phone, otp);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
