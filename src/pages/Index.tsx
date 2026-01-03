import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { TestimonialsSection } from '@/components/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedProducts />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
