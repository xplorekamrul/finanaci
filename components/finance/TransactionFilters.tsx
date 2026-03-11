"use client";

import DateRangePicker from "@/components/shared/DateRangePicker";
import { CustomSelect } from "@/components/shared/custom-select";
import { FinanceCategory } from "@prisma/client";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface DateRange {
   startDate: Date | null;
   endDate: Date | null;
   label: string;
}

interface TransactionFiltersProps {
   categories: FinanceCategory[];
   onFilterChange: (filters: {
      dateRange: DateRange | null;
      categoryId: string | null;
      type: string | null;
   }) => void;
}

export default function TransactionFilters({
   categories,
   onFilterChange,
}: TransactionFiltersProps) {
   const [dateRange, setDateRange] = useState<DateRange | null>(null);
   const [selectedCategory, setSelectedCategory] = useState<string>("");
   const [selectedType, setSelectedType] = useState<string>("");
   const [showMobileFilters, setShowMobileFilters] = useState(false);

   const handleDateRangeChange = (range: DateRange) => {
      setDateRange(range);
      onFilterChange({
         dateRange: range,
         categoryId: selectedCategory || null,
         type: selectedType || null,
      });
   };

   const handleCategoryChange = (value: string) => {
      setSelectedCategory(value);
      onFilterChange({
         dateRange,
         categoryId: value || null,
         type: selectedType || null,
      });
   };

   const handleTypeChange = (value: string) => {
      setSelectedType(value);
      onFilterChange({
         dateRange,
         categoryId: selectedCategory || null,
         type: value || null,
      });
   };

   const clearFilters = () => {
      setDateRange(null);
      setSelectedCategory("");
      setSelectedType("");
      onFilterChange({
         dateRange: null,
         categoryId: null,
         type: null,
      });
   };

   const hasActiveFilters = dateRange || selectedCategory || selectedType;

   return (
      <div className="space-y-4">
         {/* Desktop Filters */}
         <div className="hidden md:flex gap-4 items-end flex-wrap">
            {/* Date Range Picker */}
            <div className="flex-1 min-w-[250px]">
               <label className="text-sm font-medium text-foreground mb-1 block">
                  Date Range
               </label>
               <DateRangePicker onRangeChange={handleDateRangeChange} />
            </div>

            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
               <label className="text-sm font-medium text-foreground mb-1 block">
                  Category
               </label>
               <CustomSelect
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                     { value: "", label: "All Categories" },
                     ...categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                     })),
                  ]}
                  placeholder="Select category"
                  searchable
               />
            </div>

            {/* Type Filter */}
            <div className="flex-1 min-w-[150px]">
               <label className="text-sm font-medium text-foreground mb-1 block">
                  Type
               </label>
               <CustomSelect
                  value={selectedType}
                  onValueChange={handleTypeChange}
                  options={[
                     { value: "", label: "All Types" },
                     { value: "INCOME", label: "Income" },
                     { value: "EXPENSE", label: "Expense" },
                  ]}
                  placeholder="Select type"
               />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
               <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors h-fit"
               >
                  Clear Filters
               </button>
            )}
         </div>

         {/* Mobile Filters */}
         <div className="md:hidden">
            <button
               onClick={() => setShowMobileFilters(!showMobileFilters)}
               className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
               <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                     <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                        Active
                     </span>
                  )}
               </div>
               {showMobileFilters ? (
                  <X className="h-4 w-4" />
               ) : (
                  <Filter className="h-4 w-4" />
               )}
            </button>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
               <div className="mt-4 space-y-4 p-4 rounded-lg border border-border bg-card">
                  {/* Date Range Picker */}
                  <div>
                     <label className="text-sm font-medium text-foreground mb-1 block">
                        Date Range
                     </label>
                     <DateRangePicker onRangeChange={handleDateRangeChange} />
                  </div>

                  {/* Category Filter */}
                  <div>
                     <label className="text-sm font-medium text-foreground mb-1 block">
                        Category
                     </label>
                     <CustomSelect
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                        options={[
                           { value: "", label: "All Categories" },
                           ...categories.map((cat) => ({
                              value: cat.id,
                              label: cat.name,
                           })),
                        ]}
                        placeholder="Select category"
                        searchable
                     />
                  </div>

                  {/* Type Filter */}
                  <div>
                     <label className="text-sm font-medium text-foreground mb-1 block">
                        Type
                     </label>
                     <CustomSelect
                        value={selectedType}
                        onValueChange={handleTypeChange}
                        options={[
                           { value: "", label: "All Types" },
                           { value: "INCOME", label: "Income" },
                           { value: "EXPENSE", label: "Expense" },
                        ]}
                        placeholder="Select type"
                     />
                  </div>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                     <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                     >
                        Clear Filters
                     </button>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
