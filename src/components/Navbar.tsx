import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Ariy VPN
          </span>
        </div>
        <a
          href="https://cabinet.ariybot.com"
          className="gradient-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-box transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_hsl(221_78%_48%_/_0.5)]"
        >
          Личный кабинет
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
