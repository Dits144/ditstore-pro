import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  category: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export function ProductCard({ id, name, price, shortDescription, category, imageUrl, isFeatured }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'streaming': return 'Streaming';
      case 'editing': return 'Editing';
      case 'digital_tools': return 'Digital Tools';
      default: return category;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group glass-card rounded-xl overflow-hidden card-elevated hover:border-primary/30 transition-all duration-300"
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
        {isFeatured && (
          <Badge className="absolute top-3 right-3 gradient-primary border-0">
            Unggulan
          </Badge>
        )}
        <div className="text-6xl font-bold gradient-text opacity-50">
          {name.charAt(0)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {getCategoryLabel(category)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xl font-bold gradient-text">
            {formatPrice(price)}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <Link to={`/products/${id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              Detail
            </Button>
          </Link>
          <Link to={`/checkout/${id}`} className="flex-1">
            <Button variant="hero" className="w-full" size="sm">
              Beli
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
