import { motion } from "framer-motion";
import { useMemo } from "react";

const InfraSection = () => {
  const nodes = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 40; i++) {
      pts.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        delay: Math.random() * 3,
      });
    }
    return pts;
  }, []);

  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          lines.push({
            x1: nodes[i].x,
            y1: nodes[i].y,
            x2: nodes[j].x,
            y2: nodes[j].y,
          });
        }
      }
    }
    return lines;
  }, [nodes]);

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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full max-w-4xl mx-auto aspect-[2/1] glass rounded-3xl overflow-hidden"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {connections.map((line, i) => (
              <line
                key={i}
                x1={`${line.x1}%`}
                y1={`${line.y1}%`}
                x2={`${line.x2}%`}
                y2={`${line.y2}%`}
                stroke="hsl(221, 78%, 48%)"
                strokeWidth="0.15"
                opacity="0.3"
              />
            ))}
            {nodes.map((node, i) => (
              <circle
                key={i}
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size * 0.3}
                fill="hsl(221, 78%, 55%)"
                opacity="0.7"
              >
                <animate
                  attributeName="opacity"
                  values="0.4;0.9;0.4"
                  dur="3s"
                  begin={`${node.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default InfraSection;
