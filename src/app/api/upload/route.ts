import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminAuth, validateImageUpload, checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Authorization
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Admin authentication token required to upload assets.'
      }, { status: 401 });
    }

    // 2. Rate limit: max 20 uploads per minute
    const clientIp = req.headers.get('x-forwarded-for') || 'admin-client';
    const rateCheck = checkRateLimit(`upload-${clientIp}`, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        message: `Upload rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds.`
      }, { status: 429 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      } else {
        return NextResponse.json({ success: false, message: 'No image file uploaded' }, { status: 400 });
      }
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file || typeof file === 'string') continue;
      
      // 3. Strict Image validation (size + mime type + extension)
      const validation = validateImageUpload(file);
      if (!validation.valid) {
        return NextResponse.json({
          success: false,
          message: `Security validation failed: ${validation.error}`
        }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 4. Secure filename generation preventing directory traversal
      const rawExt = path.extname(file.name).toLowerCase() || '.jpg';
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(rawExt) ? rawExt : '.jpg';
      const cleanBase = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
      const uniqueFilename = `jeans_${Date.now()}_${Math.floor(Math.random() * 10000)}_${cleanBase}${safeExt}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Double-check target path stays within uploadDir
      if (!filePath.startsWith(uploadDir)) {
        return NextResponse.json({ success: false, message: 'Security violation: Path traversal detected' }, { status: 403 });
      }

      fs.writeFileSync(filePath, buffer);
      uploadedUrls.push(`/uploads/${uniqueFilename}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Images validated and uploaded securely',
      urls: uploadedUrls,
      url: uploadedUrls[0]
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, message: 'Failed to upload images securely', error: String(error) }, { status: 500 });
  }
}
