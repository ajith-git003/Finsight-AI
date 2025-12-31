import { Sparkles, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">FinSight AI</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10 text-center">
          <p className="text-sm text-background/50">
            © 2025 FinSight AI. Built with ❤️ for smarter money decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
