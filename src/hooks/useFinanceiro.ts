
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TransacaoFinanceira {
  id: string;
  data: string;
  descricao: string;
  tatuador?: string;
  tipo: 'Receita' | 'Despesa';
  valor: number;
  categoria: string;
  created_at: string;
}

export const useFinanceiro = () => {
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setTransacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarTransacao = async (transacao: Omit<TransacaoFinanceira, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .insert([transacao])
        .select()
        .single();

      if (error) throw error;
      
      setTransacoes(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!",
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação.",
        variant: "destructive",
      });
    }
  };

  const calcularResumo = () => {
    const receitas = transacoes
      .filter(t => t.tipo === 'Receita')
      .reduce((acc, t) => acc + t.valor, 0);
    
    const despesas = transacoes
      .filter(t => t.tipo === 'Despesa')
      .reduce((acc, t) => acc + t.valor, 0);
    
    return {
      receitas,
      despesas,
      saldo: receitas - despesas
    };
  };

  useEffect(() => {
    fetchTransacoes();
  }, []);

  return {
    transacoes,
    loading,
    adicionarTransacao,
    calcularResumo,
    refetch: fetchTransacoes
  };
};
