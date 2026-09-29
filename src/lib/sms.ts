/**
 * Real SMS Gateway Service for Shree Fashion Hub
 * Supports:
 * 1. Fast2SMS (India's easiest & most popular OTP SMS provider - instant setup)
 * 2. Twilio (Global SMS provider)
 */

interface SendSmsResult {
  success: boolean;
  provider?: string;
  message: string;
}

export async function sendRealPhoneOtp(phone: string, otp: string): Promise<SendSmsResult> {
  const digits = phone.replace(/\D/g, '').slice(-10);

  // 1. Check for Fast2SMS (Recommended for India)
  const fast2SmsKey = process.env.FAST2SMS_API_KEY || '2LsZBkaiWR3rfUA6pXlGcSvJ9nw8IydhzT5bg17ueqxNCKEm0o94Ag7k5Zup3cY1SRv0lw6XQBjWrUta';
  if (fast2SmsKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2SmsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: digits
        })
      });

      const data = await response.json();
      if (data.return) {
        console.log(`[REAL SMS DELIVERED via Fast2SMS] Mobile: ${digits} | OTP: ${otp}`);
        return {
          success: true,
          provider: 'Fast2SMS',
          message: `Real SMS successfully delivered to +91 ${digits}`
        };
      } else {
        console.warn('[Fast2SMS API Response]', data);
        const errorMsg = data.message || 'Fast2SMS verification needed';
        return {
          success: false,
          provider: 'Fast2SMS',
          message: errorMsg
        };
      }
    } catch (err) {
      console.error('[Fast2SMS Network Error]', err);
    }
  }

  // 2. Check for Twilio
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioAuth && twilioFrom) {
    try {
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams({
        To: `+91${digits}`,
        From: twilioFrom,
        Body: `Your Shree Fashion Hub verification code is: ${otp}. Valid for 10 minutes.`
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (response.ok) {
        console.log(`[REAL SMS SENT via Twilio] Mobile: +91${digits} | OTP: ${otp}`);
        return {
          success: true,
          provider: 'Twilio',
          message: `SMS successfully delivered to +91 ${digits}`
        };
      }
    } catch (err) {
      console.error('[Twilio Error]', err);
    }
  }

  // Default fallback: No SMS gateway API key configured yet in environment
  return {
    success: false,
    message: 'SMS service simulated.'
  };
}

export async function sendOrderSmsNotification(
  customerPhone: string,
  orderNumber: string,
  totalAmount: number,
  customerName: string
): Promise<void> {
  const digits = customerPhone.replace(/\D/g, '').slice(-10);
  const fast2SmsKey = process.env.FAST2SMS_API_KEY || '2LsZBkaiWR3rfUA6pXlGcSvJ9nw8IydhzT5bg17ueqxNCKEm0o94Ag7k5Zup3cY1SRv0lw6XQBjWrUta';
  
  const customerMsg = `Shree Fashion Hub: Order #${orderNumber} confirmed! Amount: Rs.${totalAmount}. Note: Unboxing video required for returns. Thank you!`;
  const adminMsg = `[NEW ORDER] #${orderNumber} by ${customerName} for Rs.${totalAmount}. Check Admin Panel!`;
  const adminPhone = '9714475575';

  if (fast2SmsKey) {
    try {
      // Send to Customer
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2SmsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: customerMsg,
          language: 'english',
          flash: 0,
          numbers: digits
        })
      });

      // Send to Admin
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2SmsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: adminMsg,
          language: 'english',
          flash: 0,
          numbers: adminPhone
        })
      });
      console.log(`[ORDER SMS DISPATCHED] Order: ${orderNumber} to ${digits} & Admin: ${adminPhone}`);
    } catch (e) {
      console.warn('[ORDER SMS] Failed sending order SMS:', e);
    }
  }
}

