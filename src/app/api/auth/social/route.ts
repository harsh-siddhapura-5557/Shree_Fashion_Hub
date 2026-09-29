import { NextRequest, NextResponse } from 'next/server';
import { verifySocialLogin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, name, email } = body;

    if (provider !== 'google' && provider !== 'apple') {
      return NextResponse.json({ success: false, message: 'Invalid provider' }, { status: 400 });
    }

    const result = verifySocialLogin(provider, { name, email });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
