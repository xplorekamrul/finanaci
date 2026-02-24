"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface IncomeExpenseChartProps {
   data: Array<{ date: string; income: number; expense: number }>;
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
   const chartData = data.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
   }));

   return (
      <div className="card-snake-border bg-card rounded-xl shadow-lg p-6">
         <h3 className="text-lg font-semibold text-foreground mb-6">Income vs Expense</h3>
         <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
               <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
               <XAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
               <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
               <Tooltip
                  contentStyle={{
                     backgroundColor: "var(--color-card)",
                     border: "1px solid var(--color-border)",
                     borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
               />
               <Legend />
               <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  name="Income"
               />
               <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  name="Expense"
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
   );
}
