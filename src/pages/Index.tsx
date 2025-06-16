
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FinanceiroPage } from "@/components/FinanceiroPage";
import { ConversasPage } from "@/components/ConversasPage";
import { EstoquePage } from "@/components/EstoquePage";
import { VendasPage } from "@/components/VendasPage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("Financeiro");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Financeiro":
        return <FinanceiroPage />;
      case "Conversas":
        return <ConversasPage />;
      case "Estoque":
        return <EstoquePage />;
      case "Vendas":
        return <VendasPage />;
      default:
        return <FinanceiroPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">
              Maré - Estúdio de Tatuagem
            </h1>
            <p className="text-slate-400">
              Sistema de Gerenciamento - {currentPage}
            </p>
          </div>
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
