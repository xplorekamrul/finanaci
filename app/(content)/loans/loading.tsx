export default function LoansLoading() {
   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="space-y-2">
               <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
               <div className="h-6 w-96 bg-muted rounded-lg animate-pulse" />
            </div>

            <div className="space-y-6">
               <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
               <div className="h-64 bg-muted rounded-lg animate-pulse" />
            </div>
         </div>
      </main>
   );
}
