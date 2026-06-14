"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface IncomeExpenseByDateChartProps {
   data: Array<{
      date: string;
      income: number;
      expense: number;
   }>;
}

export default function IncomeExpenseByDateChart({ data }: IncomeExpenseByDateChartProps) {
   if (!data || data.length === 0) {
      return (
         <div className="w-full h-80 bg-card rounded-lg border border-border flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
         </div>
      );
   }

   // Format data for display - show only last 30 days or all if less
   const displayData = data.slice(-30).map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
   }));

   return (
      <div className="w-full bg-card rounded-lg border border-border p-6">
         <h3 className="text-lg font-semibold text-foreground mb-4">Income vs Expense</h3>
         <ResponsiveContainer width="100%" height={300}>
            <BarChart data={displayData}>
               <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
               <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: "12px" }}
               />
               <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
               <Tooltip
                  contentStyle={{
                     backgroundColor: "var(--card)",
                     border: "1px solid var(--border)",
                     borderRadius: "8px",
                  }}
                  formatter={(value: any) => `৳${(value as number).toFixed(2)}`}
               />
               <Legend />
               <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
               <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[8, 8, 0, 0]} />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
}
