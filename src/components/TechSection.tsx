import { motion } from "framer-motion";
import { Shield, Eye, Layers, Lock } from "lucide-react";

const cards = [
  {
    icon: Layers,
    title: "VLESS & Xray-core",
    desc: "Сверхбыстрые современные протоколы нового поколения.",
  },
  {
    icon: Eye,
    title: "Reality & Stealth SNI",
    desc: "Полная маскировка под обычный HTTPS-трафик. Провайдер ничего не узнает.",
  },
  {
    icon: Shield,
    title: "xHTTP & Shadowsocks",
    desc: "Резервные и надежные методы обхода самых жестких блокировок.",
  },
  {
    icon: Lock,
    title: "No-Logs Policy",
    desc: "Трафик шифруется и нигде не сохраняется. Полная конфиденциальность.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const TechSection = () => {
  return (
    <section className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16 text-foreground"
        >
          Технологии <span className="gradient-text">скрытности</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass glass-hover rounded-2xl p-8 transition-all duration-500 group cursor-default"
            >
              <card.icon className="h-8 w-8 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;
