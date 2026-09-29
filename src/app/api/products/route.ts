import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductById, saveProduct, deleteProduct } from '@/lib/db';
import { verifyAdminAuth, sanitizeString } from '@/lib/security';
import { Product } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const size = searchParams.get('size');

    if (id) {
      const product = getProductById(id);
      if (!product) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    let products = getProducts();

    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }

    if (size) {
      products = products.filter(p => p.sizes.includes(size));
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch products', error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Authorization
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Admin credentials required to modify product catalog.'
      }, { status: 401 });
    }

    const body: Product = await req.json();

    if (!body.title || !body.price || !body.sizes || body.sizes.length === 0) {
      return NextResponse.json({ success: false, message: 'Title, price, and at least one size are required' }, { status: 400 });
    }

    // Sanitize string inputs to protect against XSS
    const sanitizedTitle = sanitizeString(body.title);
    const sanitizedTagline = sanitizeString(body.tagline || '');
    const sanitizedDescription = sanitizeString(body.description || '');

    const price = Math.max(0, Number(body.price));
    const originalPrice = Math.max(price, Number(body.originalPrice || body.price));
    const stock = Math.max(0, Number(body.stock || 25));

    // Auto-assign ID and slug if new
    const productToSave: Product = {
      ...body,
      title: sanitizedTitle,
      tagline: sanitizedTagline,
      description: sanitizedDescription,
      id: body.id || `prod-${Date.now()}`,
      slug: body.slug || sanitizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: body.rating || 5.0,
      reviewCount: body.reviewCount || 1,
      stock,
      price,
      originalPrice,
      discountPercentage: originalPrice > price 
        ? Math.round(((originalPrice - price) / originalPrice) * 100) 
        : 0
    };

    const saved = saveProduct(productToSave);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save product securely', error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // 1. Verify Admin Authorization
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Admin credentials required to delete products.'
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete product', error: String(error) }, { status: 500 });
  }
}
