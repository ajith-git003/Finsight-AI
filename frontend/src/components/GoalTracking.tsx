import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, TrendingUp, PiggyBank, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
}

const GoalTracking = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: "1", name: "Vacation", targetAmount: 50000, savedAmount: 15000 },
    { id: "2", name: "Emergency Fund", targetAmount: 100000, savedAmount: 45000 },
    { id: "3", name: "New Laptop", targetAmount: 80000, savedAmount: 32000 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: 0,
    savedAmount: 0
  });

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          name: newGoal.name,
          targetAmount: newGoal.targetAmount,
          savedAmount: newGoal.savedAmount || 0
        }
      ]);
      setNewGoal({ name: "", targetAmount: 0, savedAmount: 0 });
      setIsDialogOpen(false);
    }
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-primary";
    if (percentage >= 75) return "bg-primary";
    return "bg-secondary";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle2 className="w-5 h-5 text-primary" />;
    if (percentage >= 75) return <TrendingUp className="w-5 h-5 text-primary" />;
    return <PiggyBank className="w-5 h-5 text-secondary" />;
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return "Goal reached!";
    if (percentage >= 75) return "Almost there!";
    if (percentage >= 50) return "Halfway there";
    return "Keep saving";
  };

  return (
    <section id="goals" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <PiggyBank className="w-4 h-4" />
            Savings Goals
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Savings Goals
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Set savings targets and track your progress towards achieving your financial dreams.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Add Goal Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-end mb-6"
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-accent hover:opacity-90 text-primary-foreground shadow-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Savings Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Create New Savings Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Goal Name</label>
                    <Input
                      type="text"
                      placeholder="e.g., Vacation, New Car, Emergency Fund"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Target Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter target amount"
                      value={newGoal.targetAmount || ""}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Initial Saved Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount already saved"
                      value={newGoal.savedAmount || ""}
                      onChange={(e) => setNewGoal({ ...newGoal, savedAmount: Number(e.target.value) })}
                    />
                  </div>
                  <Button onClick={addGoal} className="w-full bg-gradient-accent hover:opacity-90">
                    Create Savings Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-card rounded-2xl border border-border"
              >
                <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No savings goals yet. Add your first goal!</p>
              </motion.div>
            ) : (
              goals.map((goal, index) => {
                const percentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                const remaining = goal.targetAmount - goal.savedAmount;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Target className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-lg text-foreground">{goal.name}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(percentage)}
                            <span className={`text-sm ${
                              percentage >= 100 ? "text-primary" : 
                              percentage >= 75 ? "text-primary" : "text-secondary"
                            }`}>
                              {getStatusText(percentage)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGoal(goal.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ₹{goal.savedAmount.toLocaleString()} saved of ₹{goal.targetAmount.toLocaleString()} goal
                        </span>
                        <span className={`font-medium ${
                          remaining <= 0 ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {remaining > 0 ? `₹${remaining.toLocaleString()} to go` : "Completed!"}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={percentage} 
                          className="h-3 bg-muted"
                        />
                        <div 
                          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {percentage.toFixed(0)}% of goal reached
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Summary Card */}
          {goals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 bg-gradient-accent rounded-2xl p-6 shadow-glow"
            >
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-1">Total Goal Value</p>
                  <p className="font-display text-2xl font-bold text-primary-foreground">
                    ₹{goals.reduce((acc, g) => acc + g.targetAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-1">Total Saved So Far</p>
                  <p className="font-display text-2xl font-bold text-primary-foreground">
                    ₹{goals.reduce((acc, g) => acc + g.savedAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-1">Goals Completed</p>
                  <p className="font-display text-2xl font-bold text-primary-foreground">
                    {goals.filter(g => g.savedAmount >= g.targetAmount).length} / {goals.length}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GoalTracking;
