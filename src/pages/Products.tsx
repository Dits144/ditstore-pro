import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type CategoryFilter = 'all' | 'streaming' | 'editing' | 'digital_tools';

interface Product {
  id: string;
  name: string;
  price: number;
  short_description: string | null;
  category: string;
  image_url: string | null;
  is_featured: boolean | null;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CategoryFilter>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filter]);

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'streaming', label: 'Streaming' },
    { value: 'editing', label: 'Editing' },
    { value: 'digital_tools', label: 'Digital Tools' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Produk <span className="gradient-text">Digital Premium</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih layanan digital premium sesuai kebutuhan Anda dengan harga terbaik dan garansi penuh.
            </p>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={filter === cat.value ? 'hero' : 'outline'}
                size="sm"
                onClick={() => setFilter(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Tidak ada produk ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    shortDescription={product.short_description || ''}
                    category={product.category}
                    imageUrl={product.image_url || undefined}
                    isFeatured={product.is_featured || false}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
