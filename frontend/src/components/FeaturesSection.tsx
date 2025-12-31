import { motion } from "framer-motion";
import { Upload, MessageSquare, TrendingUp, Target } from "lucide-react";

const features = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Import Expenses",
    description: "Upload your CSV file with transactions and let AI analyze your spending patterns automatically.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Natural Conversations",
    description: "Ask questions in plain English like 'How much did I spend on food?' and get instant answers.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Smart Insights",
    description: "AI analyzes your data to provide personalized recommendations and identify saving opportunities.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Goal Tracking",
    description: "Set savings goals and get actionable plans to achieve them with AI-powered strategies.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simple steps to take control of your finances with AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-card transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display font-bold text-muted-foreground text-sm">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
