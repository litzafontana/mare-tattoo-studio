
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Produto } from './useProdutos';

export interface ItemVenda {
  id?: string;
  produto_id: string;
  produto?: Produto;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  data: string;
  total: number;
  status: string;
  created_at: string;
  itens_venda?: ItemVenda[];
}

export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVendas = async () => {
    try {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          itens_venda (
            *,
            produtos (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendas(data || []);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vendas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const criarVenda = async (itens: ItemVenda[]) => {
    try {
      const total = itens.reduce((acc, item) => acc + item.subtotal, 0);
      
      // Criar a venda
      const { data: venda, error: vendaError } = await supabase
        .from('vendas')
        .insert([{ total }])
        .select()
        .single();

      if (vendaError) throw vendaError;

      // Criar os itens da venda
      const itensParaInserir = itens.map(item => ({
        venda_id: venda.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        subtotal: item.subtotal
      }));

      const { error: itensError } = await supabase
        .from('itens_venda')
        .insert(itensParaInserir);

      if (itensError) throw itensError;

      // Atualizar estoque dos produtos usando RPC (Remote Procedure Call)
      for (const item of itens) {
        const { data: produto } = await supabase
          .from('produtos')
          .select('estoque')
          .eq('id', item.produto_id)
          .single();

        if (produto) {
          const novoEstoque = produto.estoque - item.quantidade;
          
          const { error: estoqueError } = await supabase
            .from('produtos')
            .update({ 
              estoque: novoEstoque,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.produto_id);

          if (estoqueError) throw estoqueError;
        }
      }

      // Adicionar transação financeira
      await supabase
        .from('transacoes_financeiras')
        .insert([{
          data: new Date().toISOString().split('T')[0],
          descricao: 'Venda de bebidas',
          tipo: 'Receita',
          valor: total,
          categoria: 'Bebida'
        }]);

      await fetchVendas();
      
      toast({
        title: "Sucesso",
        description: `Venda de R$ ${total.toFixed(2)} realizada com sucesso!`,
      });

      return venda;
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a venda.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  return {
    vendas,
    loading,
    criarVenda,
    refetch: fetchVendas
  };
};
