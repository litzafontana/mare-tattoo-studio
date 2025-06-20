
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FinanceiroPage } from "@/components/FinanceiroPage";
import { AgendaPage } from "@/components/AgendaPage";
import { ConversasPage } from "@/components/ConversasPage";
import { EstoquePage } from "@/components/EstoquePage";
import { VendasPage } from "@/components/VendasPage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("Financeiro");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Financeiro":
        return <FinanceiroPage />;
      case "Agenda":
        return <AgendaPage />;
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
          <div className="mb-6 flex items-center space-x-4">
            <img 
              src="/lovable-uploads/fd1303f1-809d-4b6d-b392-40ee35f46d05.png" 
              alt="Maré Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">
                Maré - Estúdio de Tatuagem
              </h1>
              <p className="text-slate-400">
                Sistema de Gerenciamento - {currentPage}
              </p>
            </div>
          </div>
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
