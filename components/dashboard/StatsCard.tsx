import { ReactNode } from "react";

interface StatsCardProps {
   title: string;
   amount: number | string;
   suffix?: string;
   icon: ReactNode;
   color: string;
   bgColor: string;
}

export default function StatsCard({
   title,
   amount,
   suffix,
   icon,
   color,
   bgColor,
}: StatsCardProps) {
   const formattedAmount =
      typeof amount === "number" ? amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : amount;

   return (
      <div className="card-snake-border bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
         <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
               <p className="text-sm font-medium text-muted-foreground">{title}</p>
               <p className="text-3xl font-bold text-foreground">
                  {formattedAmount}
                  {suffix && <span className="text-lg ml-1">{suffix}</span>}
               </p>
            </div>
            <div className={`${bgColor} ${color} p-3 rounded-lg`}>{icon}</div>
         </div>
      </div>
   );
}
