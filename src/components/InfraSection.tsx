import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

// Real country locations on a world map (x%, y%)
const countries = [
  { name: "🇺🇸 США", x: 18, y: 38 },
  { name: "🇨🇦 Канада", x: 20, y: 28 },
  { name: "🇧🇷 Бразилия", x: 32, y: 65 },
  { name: "🇬🇧 UK", x: 46, y: 30 },
  { name: "🇩🇪 Германия", x: 50, y: 32 },
  { name: "🇫🇷 Франция", x: 48, y: 35 },
  { name: "🇳🇱 Нидерланды", x: 49, y: 30 },
  { name: "🇸🇪 Швеция", x: 53, y: 24 },
  { name: "🇫🇮 Финляндия", x: 56, y: 22 },
  { name: "🇵🇱 Польша", x: 54, y: 33 },
  { name: "🇷🇴 Румыния", x: 56, y: 37 },
  { name: "🇹🇷 Турция", x: 58, y: 40 },
  { name: "🇦🇪 ОАЭ", x: 63, y: 48 },
  { name: "🇮🇳 Индия", x: 70, y: 50 },
  { name: "🇸🇬 Сингапур", x: 76, y: 58 },
  { name: "🇯🇵 Япония", x: 85, y: 38 },
  { name: "🇰🇷 Корея", x: 83, y: 38 },
  { name: "🇦🇺 Австралия", x: 83, y: 72 },
  { name: "🇿🇦 ЮАР", x: 55, y: 72 },
  { name: "🇮🇱 Израиль", x: 58, y: 43 },
  { name: "🇰🇿 Казахстан", x: 65, y: 34 },
  { name: "🇺🇦 Украина", x: 57, y: 34 },
  { name: "🇮🇹 Италия", x: 51, y: 38 },
  { name: "🇪🇸 Испания", x: 46, y: 40 },
  { name: "🇦🇷 Аргентина", x: 28, y: 78 },
  { name: "🇲🇽 Мексика", x: 15, y: 48 },
  { name: "🇭🇰 Гонконг", x: 79, y: 47 },
];

const InfraSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Connections between nearby countries
  const connections = useMemo(() => {
    const lines: [number, number][] = [];
    for (let i = 0; i < countries.length; i++) {
      for (let j = i + 1; j < countries.length; j++) {
        const dx = countries[i].x - countries[j].x;
        const dy = countries[i].y - countries[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 18) {
          lines.push([i, j]);
        }
      }
    }
    return lines;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      time += 0.005;

      // Draw connections with animated pulse
      connections.forEach(([i, j], idx) => {
        const a = countries[i];
        const b = countries[j];
        const ax = (a.x / 100) * w;
        const ay = (a.y / 100) * h;
        const bx = (b.x / 100) * w;
        const by = (b.y / 100) * h;

        // Animated data pulse along the line
        const pulsePos = (time * 0.8 + idx * 0.3) % 1;
        const px = ax + (bx - ax) * pulsePos;
        const py = ay + (by - ay) * pulsePos;

        // Line
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `rgba(26, 86, 219, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pulse dot
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 86, 219, 0.7)`;
        ctx.fill();
      });

      // Draw nodes
      countries.forEach((c, i) => {
        const cx = (c.x / 100) * w;
        const cy = (c.y / 100) * h;
        const pulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
        const isHovered = hoveredNode === i;
        const radius = isHovered ? 5 : 3;

        // Glow
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 86, 219, ${pulse * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? `rgba(60, 130, 255, 1)`
          : `rgba(26, 86, 219, ${pulse})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [connections, hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;

    let closest = -1;
    let minDist = Infinity;
    countries.forEach((c, i) => {
      const d = Math.sqrt((c.x - mx) ** 2 + (c.y - my) ** 2);
      if (d < 4 && d < minDist) {
        minDist = d;
        closest = i;
      }
    });
    setHoveredNode(closest >= 0 ? closest : null);
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full max-w-5xl mx-auto aspect-[2/1] glass rounded-3xl overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Country labels */}
          {countries.map((c, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: "translate(-50%, -180%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredNode === i ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs font-semibold text-primary-foreground glass px-2 py-1 rounded-md whitespace-nowrap">
                {c.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InfraSection;
