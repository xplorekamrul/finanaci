"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryChartProps {
   data: Array<{ name: string; income: number; expense: number; icon: string | null }>;
}

const COLORS = [
   "#3b82f6",
   "#8b5cf6",
   "#ec4899",
   "#f59e0b",
   "#10b981",
   "#06b6d4",
   "#6366f1",
   "#f97316",
];

export default function CategoryChart({ data }: CategoryChartProps) {
   const expenseData = data
      .filter((item) => item.expense > 0)
      .map((item) => ({
         name: item.name,
         value: item.expense,
         icon: item.icon,
      }))
      .slice(0, 5);

   if (expenseData.length === 0) {
      return (
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 flex items-center justify-center h-80">
            <p className="text-muted-foreground">No expense data available</p>
         </div>
      );
   }

   return (
      <div className="card-snake-border bg-card rounded-xl shadow-lg p-6">
         <h3 className="text-lg font-semibold text-foreground mb-6">Expense Distribution</h3>
         <ResponsiveContainer width="100%" height={300}>
            <PieChart>
               <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
               >
                  {expenseData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
               </Pie>
               <Tooltip
                  contentStyle={{
                     backgroundColor: "var(--color-card)",
                     border: "1px solid var(--color-border)",
                     borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(value: number | undefined) => value ? value.toFixed(2) : "0"}
               />
            </PieChart>
         </ResponsiveContainer>
      </div>
   );
}
