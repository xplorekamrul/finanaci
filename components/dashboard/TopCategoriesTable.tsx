interface TopCategoriesTableProps {
   categories: Array<{
      id: string;
      name: string;
      icon: string | null;
      amount: number;
      count: number;
   }>;
}

export default function TopCategoriesTable({ categories }: TopCategoriesTableProps) {
   if (categories.length === 0) {
      return (
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Top Categories</h3>
            <p className="text-muted-foreground text-center py-8">No transaction data available</p>
         </div>
      );
   }

   return (
      <div className="card-snake-border bg-card rounded-xl shadow-lg overflow-hidden">
         <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Top Categories</h3>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-muted/50">
                  <tr>
                     <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                     <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Amount</th>
                     <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Transactions</th>
                     <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Avg</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {categories.map((category, idx) => (
                     <tr
                        key={category.id}
                        className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-primary/5"
                           } hover:bg-primary/10`}
                     >
                        <td className="px-6 py-4 text-sm">
                           <div className="flex items-center gap-3">
                              {category.icon && <span className="text-lg">{category.icon}</span>}
                              <span className="font-medium text-foreground">{category.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                           {category.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                           })}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-muted-foreground">{category.count}</td>
                        <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                           {(category.amount / category.count).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                           })}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
