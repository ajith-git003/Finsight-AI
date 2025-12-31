import { motion } from "framer-motion";
import heroIllustration from "@/assets/hero-illustration.png";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Moon, Sun, MessageSquare, PiggyBank, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Mock data for pie chart
const pieData = [
  { name: "Food", value: 30, color: "hsl(var(--primary))" },
  { name: "Transport", value: 20, color: "hsl(var(--secondary))" },
  { name: "Shopping", value: 25, color: "hsl(var(--accent))" },
  { name: "Bills", value: 25, color: "hsl(var(--muted))" },
];

const HeroSection = () => {
  const [isDark, setIsDark] = useState(false);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 rounded-full bg-secondary/30"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-8 h-8 rounded-full bg-primary/20"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-6 h-6 rounded-full bg-accent/30"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between py-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">FinSight AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-16 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft border border-border">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">AI-Powered Financial Insights</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Smart Money,
              <br />
              <span className="text-gradient-accent">Smarter Decisions</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Ask your AI assistant anything about your finances. Get personalized insights to save ₹10,000 next month or reach any financial goal.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={() => scrollToSection("ai-chat")}>
                Start Chatting
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => scrollToSection("dashboard")}>
                View Dashboard
              </Button>
            </div>

          </motion.div>

          {/* Carousel Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <Carousel
              plugins={[autoplayPlugin.current]}
              opts={{ loop: true }}
              className="w-full max-w-lg mx-auto"
            >
              <CarouselContent>
                {/* Slide 1: Hero Illustration */}
                <CarouselItem>
                  <div className="p-2">
                    <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-6 shadow-soft">
                      <img
                        src={heroIllustration}
                        alt="FinSight AI Illustration"
                        className="w-full h-auto animate-float"
                      />
                    </div>
                  </div>
                </CarouselItem>

                {/* Slide 2: Finance Overview - Pie Chart */}
                <CarouselItem>
                  <div className="p-2">
                    <div className="rounded-2xl bg-card backdrop-blur-sm border border-border/50 p-6 shadow-soft h-[350px] flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground">Spending Overview</h3>
                      </div>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {pieData.map((item) => (
                          <div key={item.name} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CarouselItem>

                {/* Slide 3: AI Chat Preview */}
                <CarouselItem>
                  <div className="p-2">
                    <div className="rounded-2xl bg-card backdrop-blur-sm border border-border/50 p-6 shadow-soft h-[350px] flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground">AI Assistant</h3>
                      </div>
                      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                        <div className="self-end bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
                          <p className="text-sm">How can I save more money this month?</p>
                        </div>
                        <div className="self-start bg-muted px-4 py-2 rounded-2xl rounded-bl-md max-w-[85%]">
                          <p className="text-sm text-foreground">Based on your spending, you can save ₹5,000 by reducing food delivery orders by 30%. Want me to create a budget plan?</p>
                        </div>
                        <div className="self-end bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-md max-w-[70%]">
                          <p className="text-sm">Yes, please!</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3 border border-border/50">
                        <span className="text-sm text-muted-foreground flex-1">Ask me anything...</span>
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>

                {/* Slide 4: Savings Goal Card */}
                <CarouselItem>
                  <div className="p-2">
                    <div className="rounded-2xl bg-card backdrop-blur-sm border border-border/50 p-6 shadow-soft h-[350px] flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center">
                          <PiggyBank className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground">Savings Goals</h3>
                      </div>
                      <div className="flex-1 flex flex-col gap-4">
                        {/* Vacation Fund */}
                        <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">🏖️ Vacation Fund</span>
                            <span className="text-sm text-primary font-semibold">40%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-gradient-accent rounded-full" style={{ width: "40%" }} />
                          </div>
                          <p className="text-sm text-muted-foreground">₹20,000 saved of ₹50,000</p>
                        </div>
                        {/* Emergency Fund */}
                        <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">🛡️ Emergency Fund</span>
                            <span className="text-sm text-primary font-semibold">75%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-gradient-golden rounded-full" style={{ width: "75%" }} />
                          </div>
                          <p className="text-sm text-muted-foreground">₹75,000 saved of ₹1,00,000</p>
                        </div>
                        {/* New Laptop */}
                        <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">💻 New Laptop</span>
                            <span className="text-sm text-primary font-semibold">60%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
                          </div>
                          <p className="text-sm text-muted-foreground">₹48,000 saved of ₹80,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>

              {/* Carousel Dots Indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-primary/30 transition-colors"
                  />
                ))}
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
