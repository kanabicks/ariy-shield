import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Ariy VPN</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ariy VPN. Все права защищены.
        </p>
        <a
          href="https://cabinet.ariybot.com"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Личный кабинет
        </a>
      </div>
    </footer>
  );
};

export default Footer;
