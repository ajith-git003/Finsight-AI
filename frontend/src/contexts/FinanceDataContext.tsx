import { createContext, useContext, useState, ReactNode } from "react";

export interface CSVData {
  headers: string[];
  rows: Record<string, string>[];
  fileName: string;
}

export interface Transaction {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

interface FinanceDataContextType {
  csvData: CSVData | null;
  setCsvData: (data: CSVData | null) => void;
  transactions: Transaction[];
}

const FinanceDataContext = createContext<FinanceDataContextType | undefined>(undefined);

// Category detection based on common keywords
const detectCategory = (description: string): string => {
  const desc = description.toLowerCase();
  
  if (desc.includes("salary") || desc.includes("income") || desc.includes("payment received")) {
    return "Salary";
  }
  if (desc.includes("rent") || desc.includes("housing") || desc.includes("apartment")) {
    return "Rent";
  }
  if (desc.includes("grocery") || desc.includes("groceries") || desc.includes("dmart") || desc.includes("big bazaar") || desc.includes("supermarket")) {
    return "Groceries";
  }
  if (desc.includes("restaurant") || desc.includes("food") || desc.includes("zomato") || desc.includes("swiggy") || desc.includes("cafe") || desc.includes("starbucks") || desc.includes("coffee")) {
    return "Food";
  }
  if (desc.includes("uber") || desc.includes("ola") || desc.includes("petrol") || desc.includes("fuel") || desc.includes("transport") || desc.includes("metro") || desc.includes("bus")) {
    return "Transport";
  }
  if (desc.includes("electric") || desc.includes("utility") || desc.includes("water") || desc.includes("gas") || desc.includes("bill")) {
    return "Utilities";
  }
  if (desc.includes("netflix") || desc.includes("movie") || desc.includes("entertainment") || desc.includes("spotify") || desc.includes("amazon prime")) {
    return "Entertainment";
  }
  if (desc.includes("hospital") || desc.includes("pharmacy") || desc.includes("medical") || desc.includes("health") || desc.includes("doctor")) {
    return "Healthcare";
  }
  
  return "Other";
};

// Detect transaction type
const detectType = (row: Record<string, string>, headers: string[]): "income" | "expense" => {
  // Check for explicit type column
  const typeCol = headers.find(h => h.toLowerCase().includes("type"));
  if (typeCol && row[typeCol]) {
    const typeValue = row[typeCol].toLowerCase();
    if (typeValue.includes("income") || typeValue.includes("credit")) return "income";
    if (typeValue.includes("expense") || typeValue.includes("debit")) return "expense";
  }
  
  // Check for credit/debit columns
  const creditCol = headers.find(h => h.toLowerCase().includes("credit"));
  const debitCol = headers.find(h => h.toLowerCase().includes("debit"));
  
  if (creditCol && row[creditCol] && parseFloat(row[creditCol].replace(/[^0-9.-]/g, "")) > 0) {
    return "income";
  }
  if (debitCol && row[debitCol] && parseFloat(row[debitCol].replace(/[^0-9.-]/g, "")) > 0) {
    return "expense";
  }
  
  // Check description for keywords
  const descCol = headers.find(h => 
    h.toLowerCase().includes("description") || 
    h.toLowerCase().includes("narration") ||
    h.toLowerCase().includes("particular")
  );
  
  if (descCol && row[descCol]) {
    const desc = row[descCol].toLowerCase();
    if (desc.includes("salary") || desc.includes("credit") || desc.includes("received") || desc.includes("income")) {
      return "income";
    }
  }
  
  return "expense";
};

// Parse amount from various formats
const parseAmount = (row: Record<string, string>, headers: string[], type: "income" | "expense"): number => {
  // Check for credit/debit columns first
  const creditCol = headers.find(h => h.toLowerCase().includes("credit"));
  const debitCol = headers.find(h => h.toLowerCase().includes("debit"));
  
  if (type === "income" && creditCol && row[creditCol]) {
    const val = parseFloat(row[creditCol].replace(/[^0-9.-]/g, ""));
    if (!isNaN(val) && val > 0) return Math.abs(val);
  }
  
  if (type === "expense" && debitCol && row[debitCol]) {
    const val = parseFloat(row[debitCol].replace(/[^0-9.-]/g, ""));
    if (!isNaN(val) && val > 0) return Math.abs(val);
  }
  
  // Look for amount column
  const amountCol = headers.find(h => 
    h.toLowerCase().includes("amount") || 
    h.toLowerCase().includes("value") ||
    h.toLowerCase().includes("total")
  );
  
  if (amountCol && row[amountCol]) {
    const val = parseFloat(row[amountCol].replace(/[^0-9.-]/g, ""));
    if (!isNaN(val)) return Math.abs(val);
  }
  
  return 0;
};

// Parse date from various formats
const parseDate = (row: Record<string, string>, headers: string[]): string => {
  const dateCol = headers.find(h => 
    h.toLowerCase().includes("date") || 
    h.toLowerCase().includes("time")
  );
  
  if (dateCol && row[dateCol]) {
    try {
      const date = new Date(row[dateCol]);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    } catch {
      // Return raw value if parsing fails
      return row[dateCol].slice(0, 10);
    }
  }
  
  return "Unknown";
};

export const FinanceDataProvider = ({ children }: { children: ReactNode }) => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);

  // Convert CSV data to transactions
  const transactions: Transaction[] = csvData
    ? csvData.rows.map((row, index) => {
        const descCol = csvData.headers.find(h => 
          h.toLowerCase().includes("description") || 
          h.toLowerCase().includes("narration") ||
          h.toLowerCase().includes("particular")
        );
        
        const description = descCol ? row[descCol] || "Unknown" : "Unknown";
        const type = detectType(row, csvData.headers);
        const amount = parseAmount(row, csvData.headers, type);
        const category = detectCategory(description);
        const date = parseDate(row, csvData.headers);
        
        return {
          id: index + 1,
          category,
          description: description.slice(0, 50),
          amount,
          date,
          type,
        };
      }).filter(t => t.amount > 0)
    : [];

  return (
    <FinanceDataContext.Provider value={{ csvData, setCsvData, transactions }}>
      {children}
    </FinanceDataContext.Provider>
  );
};

export const useFinanceData = () => {
  const context = useContext(FinanceDataContext);
  if (context === undefined) {
    throw new Error("useFinanceData must be used within a FinanceDataProvider");
  }
  return context;
};
