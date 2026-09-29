import { getProducts, getReviews } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FitGuide } from '@/components/FitGuide';
import { ProductGrid } from '@/components/ProductGrid';
import { UnboxingPolicySection } from '@/components/UnboxingPolicySection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = getProducts();
  const reviews = getReviews();

  return (
    <main className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Showcase */}
      <Hero />

      {/* Interactive Fit Guide */}
      <FitGuide />

      {/* Products Catalog with Filters */}
      <ProductGrid initialProducts={products} />

      {/* Unboxing Video Return Policy */}
      <UnboxingPolicySection />

      {/* Verified Reviews */}
      <ReviewsSection initialReviews={reviews} />

      {/* Footer */}
      <Footer />

      {/* Slide-over Bag Drawer */}
      <CartDrawer />

      {/* High Security Auth Modal */}
      <AuthModal />
    </main>
  );
}
