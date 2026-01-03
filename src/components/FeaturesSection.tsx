import { motion } from 'framer-motion';
import { Wallet, Zap, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Harga Terjangkau',
    description: 'Nikmati layanan premium dengan harga yang ramah di kantong.',
  },
  {
    icon: Zap,
    title: 'Proses Cepat & Mudah',
    description: 'Order hanya dalam hitungan menit, tanpa ribet.',
  },
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    description: 'Data pelanggan terlindungi dan transaksi aman.',
  },
  {
    icon: Headphones,
    title: 'Support Responsif',
    description: 'Tim Ditstore siap membantu kapan saja.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kenapa Pilih <span className="gradient-text">Ditstore</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ribuan pengguna telah mempercayai Ditstore untuk kebutuhan layanan digital premium mereka.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
