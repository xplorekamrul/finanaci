"use client";

import { useState, useCallback } from "react";
import { FinanceCategory, Transaction, Loan, Savings } from "@prisma/client";
import { Plus } from "lucide-react";
import CategoryForm from "@/components/finance/CategoryForm";
import CategoriesTable from "@/components/finance/CategoriesTable";
import TransactionForm from "@/components/finance/TransactionForm";
import TransactionsTable from "@/components/finance/TransactionsTable";
import LoanForm from "@/components/finance/LoanForm";
import LoansTable from "@/components/finance/LoansTable";
import SavingsForm from "@/components/finance/SavingsForm";
import SavingsTable from "@/components/finance/SavingsTable";
import Modal from "@/components/finance/Modal";
import { getFinanceCategories } from "@/actions/finance/categories";
import { getTransactions } from "@/actions/finance/transactions";
import { getLoans } from "@/actions/finance/loans";
import { getSavings } from "@/actions/finance/savings";

type Tab = "categories" | "transactions" | "loans" | "savings";

interface FinanceContentProps {
  initialCategories: FinanceCategory[];
  initialTransactions: (Transaction & { category: FinanceCategory })[];
  initialLoans: (Loan & { category: FinanceCategory | null })[];
  initialSavings: (Savings & { category: FinanceCategory | null })[];
}

export default function FinanceContent({
  initialCategories,
  initialTransactions,
  initialLoans,
  initialSavings,
}: FinanceContentProps) {
  const [tab, setTab] = useState<Tab>("categories");
  const [categories, setCategories] = useState<FinanceCategory[]>(initialCategories);
  const [transactions, setTransactions] = useState<(Transaction & { category: FinanceCategory })[]>(
    initialTransactions
  );
  const [loans, setLoans] = useState<(Loan & { category: FinanceCategory | null })[]>(initialLoans);
  const [savings, setSavings] = useState<(Savings & { category: FinanceCategory | null })[]>(
    initialSavings
  );

  const [editingCategory, setEditingCategory] = useState<FinanceCategory | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction & { category: FinanceCategory } | null>(null);
  const [editingLoan, setEditingLoan] = useState<Loan & { category: FinanceCategory | null } | null>(null);
  const [editingSavings, setEditingSavings] = useState<Savings & { category: FinanceCategory | null } | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);

  // Refresh functions
  const loadCategories = useCallback(async () => {
    try {
      const result = await getFinanceCategories();
      if (result.data) setCategories(result.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      const result = await getTransactions();
      if (result.data) setTransactions(result.data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  }, []);

  const loadLoans = useCallback(async () => {
    try {
      const result = await getLoans();
      if (result.data) setLoans(result.data);
    } catch (error) {
      console.error("Failed to load loans:", error);
    }
  }, []);

  const loadSavings = useCallback(async () => {
    try {
      const result = await getSavings();
      if (result.data) setSavings(result.data);
    } catch (error) {
      console.error("Failed to load savings:", error);
    }
  }, []);

  // Modal handlers
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    setEditingTransaction(null);
  };

  const handleCloseLoanModal = () => {
    setShowLoanModal(false);
    setEditingLoan(null);
  };

  const handleCloseSavingsModal = () => {
    setShowSavingsModal(false);
    setEditingSavings(null);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border overflow-x-auto">
        {(["categories", "transactions", "loans", "savings"] as Tab[]).map((tabName) => (
          <button
            key={tabName}
            onClick={() => setTab(tabName)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap capitalize ${
              tab === tabName
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Categories Tab */}
        {tab === "categories" && (
          <div className="space-y-6">
            {!showCategoryModal ? (
              <>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-semibold text-foreground">Finance Categories</h2>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setShowCategoryModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <CategoriesTable
                  categories={categories}
                  onEdit={(cat) => {
                    setEditingCategory(cat);
                    setShowCategoryModal(true);
                  }}
                  onRefresh={loadCategories}
                />
              </>
            ) : (
              <CategoryForm
                initialData={editingCategory}
                onClose={handleCloseCategoryModal}
                onSuccess={() => {
                  handleCloseCategoryModal();
                  loadCategories();
                }}
              />
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {tab === "transactions" && (
          <div className="space-y-6">
            {!showTransactionModal ? (
              <>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-semibold text-foreground">Transactions</h2>
                  <button
                    onClick={() => {
                      setEditingTransaction(null);
                      setShowTransactionModal(true);
                    }}
                    disabled={categories.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {categories.length === 0 && (
                  <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
                    <p className="text-sm text-muted-foreground">
                      Create a category first before adding transactions.
                    </p>
                  </div>
                )}
                <TransactionsTable
                  transactions={transactions}
                  onEdit={(trans) => {
                    setEditingTransaction(trans);
                    setShowTransactionModal(true);
                  }}
                  onRefresh={loadTransactions}
                />
              </>
            ) : (
              <TransactionForm
                categories={categories}
                initialData={editingTransaction}
                onClose={handleCloseTransactionModal}
                onSuccess={() => {
                  handleCloseTransactionModal();
                  loadTransactions();
                }}
              />
            )}
          </div>
        )}

        {/* Loans Tab */}
        {tab === "loans" && (
          <div className="space-y-6">
            {!showLoanModal ? (
              <>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-semibold text-foreground">Loans Given</h2>
                  <button
                    onClick={() => {
                      setEditingLoan(null);
                      setShowLoanModal(true);
                    }}
                    disabled={categories.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {categories.length === 0 && (
                  <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
                    <p className="text-sm text-muted-foreground">
                      Create a category first before adding loans.
                    </p>
                  </div>
                )}
                <LoansTable
                  loans={loans}
                  onEdit={(loan) => {
                    setEditingLoan(loan);
                    setShowLoanModal(true);
                  }}
                  onRefresh={loadLoans}
                />
              </>
            ) : (
              <LoanForm
                categories={categories}
                initialData={editingLoan}
                onClose={handleCloseLoanModal}
                onSuccess={() => {
                  handleCloseLoanModal();
                  loadLoans();
                }}
              />
            )}
          </div>
        )}

        {/* Savings Tab */}
        {tab === "savings" && (
          <div className="space-y-6">
            {!showSavingsModal ? (
              <>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-semibold text-foreground">Bank Savings</h2>
                  <button
                    onClick={() => {
                      setEditingSavings(null);
                      setShowSavingsModal(true);
                    }}
                    disabled={categories.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {categories.length === 0 && (
                  <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
                    <p className="text-sm text-muted-foreground">
                      Create a category first before adding savings.
                    </p>
                  </div>
                )}
                <SavingsTable
                  savings={savings}
                  onEdit={(saving) => {
                    setEditingSavings(saving);
                    setShowSavingsModal(true);
                  }}
                  onRefresh={loadSavings}
                />
              </>
            ) : (
              <SavingsForm
                categories={categories}
                initialData={editingSavings}
                onClose={handleCloseSavingsModal}
                onSuccess={() => {
                  handleCloseSavingsModal();
                  loadSavings();
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showCategoryModal} onClose={handleCloseCategoryModal}>
        <CategoryForm
          initialData={editingCategory}
          onClose={handleCloseCategoryModal}
          onSuccess={() => {
            handleCloseCategoryModal();
            loadCategories();
          }}
        />
      </Modal>

      <Modal isOpen={showTransactionModal} onClose={handleCloseTransactionModal}>
        <TransactionForm
          categories={categories}
          initialData={editingTransaction}
          onClose={handleCloseTransactionModal}
          onSuccess={() => {
            handleCloseTransactionModal();
            loadTransactions();
          }}
        />
      </Modal>

      <Modal isOpen={showLoanModal} onClose={handleCloseLoanModal}>
        <LoanForm
          categories={categories}
          initialData={editingLoan}
          onClose={handleCloseLoanModal}
          onSuccess={() => {
            handleCloseLoanModal();
            loadLoans();
          }}
        />
      </Modal>

      <Modal isOpen={showSavingsModal} onClose={handleCloseSavingsModal}>
        <SavingsForm
          categories={categories}
          initialData={editingSavings}
          onClose={handleCloseSavingsModal}
          onSuccess={() => {
            handleCloseSavingsModal();
            loadSavings();
          }}
        />
      </Modal>
    </div>
  );
}
