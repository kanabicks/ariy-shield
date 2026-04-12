import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const InteractiveCube = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const rotateX = mousePos.y * 25;
  const rotateY = mousePos.x * 25;

  const edges = [
    // Front face
    { x1: -1, y1: -1, z1: 1, x2: 1, y2: -1, z2: 1 },
    { x1: 1, y1: -1, z1: 1, x2: 1, y2: 1, z2: 1 },
    { x1: 1, y1: 1, z1: 1, x2: -1, y2: 1, z2: 1 },
    { x1: -1, y1: 1, z1: 1, x2: -1, y2: -1, z2: 1 },
    // Back face
    { x1: -1, y1: -1, z1: -1, x2: 1, y2: -1, z2: -1 },
    { x1: 1, y1: -1, z1: -1, x2: 1, y2: 1, z2: -1 },
    { x1: 1, y1: 1, z1: -1, x2: -1, y2: 1, z2: -1 },
    { x1: -1, y1: 1, z1: -1, x2: -1, y2: -1, z2: -1 },
    // Connecting edges
    { x1: -1, y1: -1, z1: -1, x2: -1, y2: -1, z2: 1 },
    { x1: 1, y1: -1, z1: -1, x2: 1, y2: -1, z2: 1 },
    { x1: 1, y1: 1, z1: -1, x2: 1, y2: 1, z2: 1 },
    { x1: -1, y1: 1, z1: -1, x2: -1, y2: 1, z2: 1 },
  ];

  const project = (x: number, y: number, z: number) => {
    const radX = (rotateX * Math.PI) / 180;
    const radY = (rotateY * Math.PI) / 180;

    // Rotate around X
    let y1 = y * Math.cos(radX) - z * Math.sin(radX);
    let z1 = y * Math.sin(radX) + z * Math.cos(radX);
    // Rotate around Y
    let x1 = x * Math.cos(radY) + z1 * Math.sin(radY);
    let z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

    const scale = 150;
    const perspective = 4;
    const factor = perspective / (perspective + z2);

    return {
      x: x1 * scale * factor + 250,
      y: y1 * scale * factor + 250,
    };
  };

  const vertices = [
    [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
    [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1],
  ];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
    >
      {/* Glowing orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsl(221 78% 48% / 0.3), transparent 70%)",
          left: `calc(50% + ${mousePos.x * 50}px)`,
          top: `calc(50% + ${mousePos.y * 50}px)`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePos.x * 30,
          y: mousePos.y * 30,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(221 78% 60% / 0.4), transparent 70%)",
        }}
        animate={{
          x: mousePos.x * -40,
          y: mousePos.y * -40,
        }}
        transition={{ type: "spring", stiffness: 30, damping: 15 }}
      />

      {/* Wireframe cube SVG */}
      <motion.svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        className="opacity-40"
        animate={{
          x: mousePos.x * 15,
          y: mousePos.y * 15,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 25 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((edge, i) => {
          const p1 = project(edge.x1, edge.y1, edge.z1);
          const p2 = project(edge.x2, edge.y2, edge.z2);
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="hsl(221, 78%, 48%)"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
          );
        })}
        {vertices.map((v, i) => {
          const p = project(v[0], v[1], v[2]);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="hsl(221, 78%, 60%)"
              filter="url(#glow)"
            />
          );
        })}
      </motion.svg>
    </div>
  );
};

export default InteractiveCube;
