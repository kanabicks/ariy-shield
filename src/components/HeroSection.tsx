import { motion } from "framer-motion";
import InteractiveCube from "./InteractiveCube";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <InteractiveCube />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(221 78% 48%) 1px, transparent 1px), linear-gradient(90deg, hsl(221 78% 48%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6"
        >
          Анонимность без компромиссов.
          <br />
          <span className="gradient-text glow-text">Твой интернет без границ.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10"
        >
          Продвинутая маскировка трафика, обход любых DPI и максимальная скорость.
          Добро пожаловать в свободную сеть.
        </motion.p>

        <motion.a
          href="https://cabinet.ariyvpn.com"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block gradient-primary rounded-xl px-10 py-4 text-lg font-bold text-primary-foreground glow-box-strong transition-shadow duration-300 hover:shadow-[0_0_80px_hsl(221_78%_48%_/_0.6)]"
        >
          Войти в систему
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
