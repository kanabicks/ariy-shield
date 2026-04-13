import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  speed: number;
}

const PARTICLE_COUNT = 60;
const RING_COUNT = 3;

const InteractiveCube = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 0.005,
        vy: (Math.random() - 0.5) * 0.005,
        vz: (Math.random() - 0.5) * 0.005,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.5,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scaleRef = useRef(150);

  const project = useCallback(
    (x: number, y: number, z: number, rotX: number, rotY: number, cx: number, cy: number) => {
      const scale = scaleRef.current;
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;

      let y1 = y * Math.cos(radX) - z * Math.sin(radX);
      let z1 = y * Math.sin(radX) + z * Math.cos(radX);
      let x1 = x * Math.cos(radY) + z1 * Math.sin(radY);
      let z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

      const perspective = 4;
      const factor = perspective / (perspective + z2);

      return {
        x: x1 * scale * factor + cx,
        y: y1 * scale * factor + cy,
        z: z2,
        factor,
      };
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const edges = [
      [-1,-1,1, 1,-1,1], [1,-1,1, 1,1,1], [1,1,1, -1,1,1], [-1,1,1, -1,-1,1],
      [-1,-1,-1, 1,-1,-1], [1,-1,-1, 1,1,-1], [1,1,-1, -1,1,-1], [-1,1,-1, -1,-1,-1],
      [-1,-1,-1, -1,-1,1], [1,-1,-1, 1,-1,1], [1,1,-1, 1,1,1], [-1,1,-1, -1,1,1],
    ];

    const vertices = [
      [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1],
      [1,-1,-1], [1,-1,1], [1,1,-1], [1,1,1],
    ];

    // Inner cube (smaller)
    const innerScale = 0.5;
    const innerVertices = vertices.map(v => v.map(c => c * innerScale));
    const innerEdges = edges.map(e => e.map(c => c * innerScale));

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      scaleRef.current = Math.min(w, h) * 0.25;

      ctx.clearRect(0, 0, w, h);

      const rotX = mousePos.y * 25 + Math.sin(t * 0.3) * 5;
      const rotY = mousePos.x * 25 + Math.cos(t * 0.2) * 5;

      // Draw orbital rings
      ctx.save();
      for (let r = 0; r < RING_COUNT; r++) {
        const ringRadius = 1.6 + r * 0.4;
        const ringOffset = (t * (0.3 + r * 0.15)) + (r * Math.PI * 2) / RING_COUNT;
        const segments = 64;

        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const rx = Math.cos(angle + ringOffset) * ringRadius;
          const ry = Math.sin(angle + ringOffset) * ringRadius * Math.cos((r * Math.PI) / RING_COUNT + t * 0.1);
          const rz = Math.sin(angle + ringOffset) * ringRadius * Math.sin((r * Math.PI) / RING_COUNT + t * 0.1);

          const p = project(rx, ry, rz, rotX, rotY, cx, cy);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        const ringAlpha = 0.12 + Math.sin(t + r) * 0.05;
        ctx.strokeStyle = `hsla(221, 78%, 55%, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Orbiting dot on each ring
        const dotAngle = t * (0.8 + r * 0.3) + r * 2;
        const dx = Math.cos(dotAngle) * ringRadius;
        const dy = Math.sin(dotAngle) * ringRadius * Math.cos((r * Math.PI) / RING_COUNT + t * 0.1);
        const dz = Math.sin(dotAngle) * ringRadius * Math.sin((r * Math.PI) / RING_COUNT + t * 0.1);
        const dp = project(dx, dy, dz, rotX, rotY, cx, cy);
        
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, 3 * dp.factor, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(221, 78%, 65%, ${0.6 + Math.sin(t * 2 + r) * 0.3})`;
        ctx.fill();
        
        // Dot glow
        const dotGlow = ctx.createRadialGradient(dp.x, dp.y, 0, dp.x, dp.y, 15 * dp.factor);
        dotGlow.addColorStop(0, `hsla(221, 78%, 60%, 0.4)`);
        dotGlow.addColorStop(1, `hsla(221, 78%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, 15 * dp.factor, 0, Math.PI * 2);
        ctx.fillStyle = dotGlow;
        ctx.fill();
      }
      ctx.restore();

      // Draw particles
      const particles = particlesRef.current;
      for (const p of particles) {
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;
        p.z += p.vz * p.speed;

        // Boundary wrap
        if (Math.abs(p.x) > 3) p.vx *= -1;
        if (Math.abs(p.y) > 3) p.vy *= -1;
        if (Math.abs(p.z) > 3) p.vz *= -1;

        const pp = project(p.x, p.y, p.z, rotX, rotY, cx, cy);
        const alpha = p.opacity * Math.max(0.2, pp.factor * 0.5);

        ctx.beginPath();
        ctx.arc(pp.x, pp.y, p.size * pp.factor, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(221, 78%, 70%, ${alpha})`;
        ctx.fill();
      }

      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
          if (dist < 1.5) {
            const pa = project(a.x, a.y, a.z, rotX, rotY, cx, cy);
            const pb = project(b.x, b.y, b.z, rotX, rotY, cx, cy);
            const lineAlpha = (1 - dist / 1.5) * 0.15;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = `hsla(221, 78%, 55%, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw inner cube
      ctx.save();
      const innerRotX = rotX * 1.5 + t * 20;
      const innerRotY = rotY * 1.5 + t * 15;
      for (const e of innerEdges) {
        const p1 = project(e[0], e[1], e[2], innerRotX, innerRotY, cx, cy);
        const p2 = project(e[3], e[4], e[5], innerRotX, innerRotY, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "hsla(221, 78%, 60%, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      for (const v of innerVertices) {
        const p = project(v[0], v[1], v[2], innerRotX, innerRotY, cx, cy);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.factor, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(221, 78%, 65%, 0.4)";
        ctx.fill();
      }
      ctx.restore();

      // Draw main cube with glow
      ctx.save();
      ctx.shadowColor = "hsla(221, 78%, 48%, 0.5)";
      ctx.shadowBlur = 8;
      for (const e of edges) {
        const p1 = project(e[0], e[1], e[2], rotX, rotY, cx, cy);
        const p2 = project(e[3], e[4], e[5], rotX, rotY, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "hsla(221, 78%, 48%, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      for (const v of vertices) {
        const p = project(v[0], v[1], v[2], rotX, rotY, cx, cy);
        
        // Vertex glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12 * p.factor);
        glow.addColorStop(0, "hsla(221, 78%, 60%, 0.5)");
        glow.addColorStop(1, "hsla(221, 78%, 60%, 0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, 12 * p.factor, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.factor, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(221, 78%, 65%, 0.8)";
        ctx.fill();
      }
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mousePos, project]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Ambient glows */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsl(221 78% 48% / 0.3), transparent 70%)",
          left: `calc(50% + ${mousePos.x * 50}px)`,
          top: `calc(50% + ${mousePos.y * 50}px)`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{ x: mousePos.x * 30, y: mousePos.y * 30 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(221 78% 60% / 0.4), transparent 70%)",
        }}
        animate={{ x: mousePos.x * -40, y: mousePos.y * -40 }}
        transition={{ type: "spring", stiffness: 30, damping: 15 }}
      />

      {/* Canvas scene */}
      <canvas
        ref={canvasRef}
        className="w-full h-full sm:w-[600px] sm:h-[600px]"
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
      />
    </div>
  );
};

export default InteractiveCube;
