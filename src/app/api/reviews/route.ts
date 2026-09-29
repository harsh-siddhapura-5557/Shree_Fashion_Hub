import { NextRequest, NextResponse } from 'next/server';
import { getReviews, addReview } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const reviews = getReviews(productId || undefined);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews', error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, authorName, rating, comment, fitFeedback } = body;

    if (!productId || !authorName || !rating || !comment) {
      return NextResponse.json({ success: false, message: 'Please provide all review fields' }, { status: 400 });
    }

    const review = addReview({
      productId,
      authorName,
      rating: Number(rating),
      comment,
      fitFeedback: fitFeedback || 'True to Size',
      verifiedPurchase: true
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to submit review', error: String(error) }, { status: 500 });
  }
}
