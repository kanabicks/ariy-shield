import { motion } from "framer-motion";
import { Globe, MapPin } from "lucide-react";

const locations = [
  { name: "США", flag: "🇺🇸", ping: "12ms" },
  { name: "Канада", flag: "🇨🇦", ping: "18ms" },
  { name: "Бразилия", flag: "🇧🇷", ping: "45ms" },
  { name: "Великобритания", flag: "🇬🇧", ping: "14ms" },
  { name: "Германия", flag: "🇩🇪", ping: "11ms" },
  { name: "Франция", flag: "🇫🇷", ping: "13ms" },
  { name: "Нидерланды", flag: "🇳🇱", ping: "10ms" },
  { name: "Швеция", flag: "🇸🇪", ping: "16ms" },
  { name: "Финляндия", flag: "🇫🇮", ping: "19ms" },
  { name: "Польша", flag: "🇵🇱", ping: "15ms" },
  { name: "Румыния", flag: "🇷🇴", ping: "22ms" },
  { name: "Турция", flag: "🇹🇷", ping: "28ms" },
  { name: "ОАЭ", flag: "🇦🇪", ping: "35ms" },
  { name: "Индия", flag: "🇮🇳", ping: "42ms" },
  { name: "Сингапур", flag: "🇸🇬", ping: "38ms" },
  { name: "Япония", flag: "🇯🇵", ping: "31ms" },
  { name: "Корея", flag: "🇰🇷", ping: "33ms" },
  { name: "Австралия", flag: "🇦🇺", ping: "55ms" },
  { name: "ЮАР", flag: "🇿🇦", ping: "62ms" },
  { name: "Израиль", flag: "🇮🇱", ping: "26ms" },
  { name: "Казахстан", flag: "🇰🇿", ping: "24ms" },
  { name: "Италия", flag: "🇮🇹", ping: "17ms" },
  { name: "Испания", flag: "🇪🇸", ping: "20ms" },
  { name: "Аргентина", flag: "🇦🇷", ping: "68ms" },
  { name: "Мексика", flag: "🇲🇽", ping: "40ms" },
  { name: "Гонконг", flag: "🇭🇰", ping: "36ms" },
  { name: "Украина", flag: "🇺🇦", ping: "21ms" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const InfraSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-glow pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(221 78% 48% / 0.3), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <Globe className="inline-block h-10 w-10 text-primary mb-4" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-6 text-foreground"
        >
          Серверы <span className="gradient-text">по всему миру</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-muted-foreground max-w-xl mx-auto mb-16"
        >
          Десятки локаций, минимальный пинг и гигабитные каналы. Выбирай любую точку планеты в один клик.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto"
        >
          {locations.map((loc) => (
            <motion.div
              key={loc.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px hsl(221 78% 48% / 0.4)",
                borderColor: "hsl(221, 78%, 48%)",
              }}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3 cursor-default transition-colors duration-300 group"
            >
              <span className="text-xl">{loc.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground leading-tight">
                  {loc.name}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {loc.ping}
                </span>
              </div>
              {/* Live indicator */}
              <div className="relative ml-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-50" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center gap-12 mt-16"
        >
          {[
            { value: "27+", label: "Локаций" },
            { value: "99.9%", label: "Аптайм" },
            { value: "10 Gbps", label: "Каналы" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InfraSection;
