import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="relative py-32">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-8 text-foreground"
        >
          Готов выйти <span className="gradient-text glow-text">из тени?</span>
        </motion.h2>

        <motion.a
          href="https://cabinet.ariybot.com"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block gradient-primary rounded-xl px-10 py-4 text-lg font-bold text-primary-foreground glow-box-strong transition-shadow duration-300 hover:shadow-[0_0_80px_hsl(221_78%_48%_/_0.6)]"
        >
          Перейти в панель управления
        </motion.a>
      </div>
    </section>
  );
};

export default CTASection;
