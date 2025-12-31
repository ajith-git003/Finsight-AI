import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ShoppingCart, Coffee, Car, Home, Zap, Film, Heart, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useFinanceData, Transaction } from "@/contexts/FinanceDataContext";

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  Salary: { icon: <Wallet className="w-4 h-4" />, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  Groceries: { icon: <ShoppingCart className="w-4 h-4" />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  Food: { icon: <Coffee className="w-4 h-4" />, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  Transport: { icon: <Car className="w-4 h-4" />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  Rent: { icon: <Home className="w-4 h-4" />, color: "text-rose-500", bgColor: "bg-rose-500/10" },
  Utilities: { icon: <Zap className="w-4 h-4" />, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  Entertainment: { icon: <Film className="w-4 h-4" />, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  Healthcare: { icon: <Heart className="w-4 h-4" />, color: "text-red-500", bgColor: "bg-red-500/10" },
  Other: { icon: <HelpCircle className="w-4 h-4" />, color: "text-gray-500", bgColor: "bg-gray-500/10" },
};

const pieChartColors = ["#f97316", "#8b5cf6", "#3b82f6", "#ec4899", "#eab308", "#ef4444", "#10b981", "#6b7280"];

// Default mock data when no CSV is uploaded
const defaultTransactions: Transaction[] = [
  { id: 1, category: "Salary", description: "Monthly Salary", amount: 75000, date: "Dec 1", type: "income" },
  { id: 2, category: "Groceries", description: "Big Bazaar", amount: 2450, date: "Dec 3", type: "expense" },
  { id: 3, category: "Food", description: "Starbucks", amount: 580, date: "Dec 5", type: "expense" },
  { id: 4, category: "Transport", description: "Uber Rides", amount: 1200, date: "Dec 7", type: "expense" },
  { id: 5, category: "Rent", description: "Monthly Rent", amount: 25000, date: "Dec 10", type: "expense" },
  { id: 6, category: "Utilities", description: "Electricity Bill", amount: 2800, date: "Dec 12", type: "expense" },
  { id: 7, category: "Entertainment", description: "Netflix Subscription", amount: 649, date: "Dec 14", type: "expense" },
  { id: 8, category: "Food", description: "Zomato Order", amount: 890, date: "Dec 15", type: "expense" },
  { id: 9, category: "Healthcare", description: "Pharmacy", amount: 1250, date: "Dec 17", type: "expense" },
  { id: 10, category: "Transport", description: "Petrol", amount: 3500, date: "Dec 19", type: "expense" },
  { id: 11, category: "Groceries", description: "DMart", amount: 3200, date: "Dec 21", type: "expense" },
  { id: 12, category: "Food", description: "Restaurant", amount: 2100, date: "Dec 22", type: "expense" },
];

const DashboardPreview = () => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const { transactions: csvTransactions, csvData } = useFinanceData();
  
  // Use CSV data if available, otherwise use default mock data
  const transactions = csvTransactions.length > 0 ? csvTransactions : defaultTransactions;
  
  // Calculate totals from transactions
  const { totalIncome, totalExpense, pieChartData } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    
    // Group expenses by category for pie chart
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    const pieData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories
    
    return { totalIncome: income, totalExpense: expense, pieChartData: pieData };
  }, [transactions]);
  
  const savings = totalIncome - totalExpense;

  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Financial Dashboard
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {csvData 
              ? `Showing data from ${csvData.fileName} (${transactions.length} transactions)`
              : "Get a complete overview of your spending, savings, and financial health at a glance."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 grid md:grid-cols-3 gap-4"
          >
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground text-sm">Total Income</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-foreground">
                ₹{totalIncome.toLocaleString()}
              </div>
              <div className="text-sm text-emerald-500 mt-1">
                {csvData ? `${transactions.filter(t => t.type === "income").length} income entries` : "+12% from last month"}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground text-sm">Total Expenses</span>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-foreground">
                ₹{totalExpense.toLocaleString()}
              </div>
              <div className="text-sm text-rose-500 mt-1">
                {csvData ? `${transactions.filter(t => t.type === "expense").length} expense entries` : "-5% from last month"}
              </div>
            </div>

            <div className="bg-gradient-accent rounded-2xl p-6 shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary-foreground/80 text-sm">Savings</span>
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-primary-foreground">
                ₹{savings.toLocaleString()}
              </div>
              <div className="text-sm text-primary-foreground/80 mt-1">
                {totalIncome > 0 ? `${Math.round((savings / totalIncome) * 100)}% of income saved` : "Upload data to see savings"}
              </div>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Expense Distribution</h3>
            <div className="h-64">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No expense data available
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold text-foreground">Recent Transactions</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllTransactions(true)}
                className="text-primary hover:text-primary/80"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction, index) => {
                const config = categoryConfig[transaction.category] || categoryConfig.Other;
                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgColor} ${config.color}`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</div>
                      </div>
                    </div>
                    <div className={`font-display font-semibold ${
                      transaction.type === "income" ? "text-emerald-500" : "text-foreground"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* All Transactions Modal */}
      <Dialog open={showAllTransactions} onOpenChange={setShowAllTransactions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">All Transactions ({transactions.length})</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] pr-2">
            <div className="space-y-3">
              <AnimatePresence>
                {transactions.map((transaction, index) => {
                  const config = categoryConfig[transaction.category] || categoryConfig.Other;
                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgColor} ${config.color}`}>
                          {config.icon}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</div>
                        </div>
                      </div>
                      <div className={`font-display font-semibold ${
                        transaction.type === "income" ? "text-emerald-500" : "text-foreground"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DashboardPreview;
