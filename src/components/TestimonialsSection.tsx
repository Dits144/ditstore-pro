import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Andi Pratama',
    role: 'Content Creator',
    content: 'Langganan Netflix Pro di Ditstore cepat dan aman. Prosesnya mudah banget, akun langsung aktif!',
    rating: 5,
  },
  {
    name: 'Sari Dewi',
    role: 'Video Editor',
    content: 'CapCut Pro dari Ditstore sangat membantu pekerjaan saya. Harga terjangkau dan fitur lengkap.',
    rating: 5,
  },
  {
    name: 'Budi Santoso',
    role: 'Mahasiswa',
    content: 'Admin responsif, akun langsung aktif. Sangat recommended untuk yang cari layanan digital premium!',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-card/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Apa Kata <span className="gradient-text">Pelanggan</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ribuan pengguna telah percaya Ditstore untuk kebutuhan digital mereka.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card rounded-xl p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6">{testimonial.content}</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
