
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  imagem?: string;
  categoria: string;
  created_at: string;
  updated_at: string;
}

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = async (produto: Omit<Produto, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert([produto])
        .select()
        .single();

      if (error) throw error;
      
      setProdutos(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: `${produto.categoria === 'tatuagem' ? 'Serviço' : 'Produto'} adicionado com sucesso!`,
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro",
        description: `Não foi possível adicionar o ${produto.categoria === 'tatuagem' ? 'serviço' : 'produto'}.`,
        variant: "destructive",
      });
    }
  };

  const atualizarProduto = async (id: string, updates: Partial<Produto>) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProdutos(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Sucesso",
        description: `${data.categoria === 'tatuagem' ? 'Serviço' : 'Produto'} atualizado com sucesso!`,
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar o ${updates.categoria === 'tatuagem' ? 'serviço' : 'produto'}.`,
        variant: "destructive",
      });
    }
  };

  const removerProduto = async (id: string) => {
    try {
      const produto = produtos.find(p => p.id === id);
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProdutos(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: `${produto?.categoria === 'tatuagem' ? 'Serviço' : 'Produto'} removido com sucesso!`,
      });
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      });
    }
  };

  // Funções utilitárias para filtrar por categoria
  const getBebidas = () => produtos.filter(p => p.categoria === 'bebida');
  const getTatuagens = () => produtos.filter(p => p.categoria === 'tatuagem');

  useEffect(() => {
    fetchProdutos();
  }, []);

  return {
    produtos,
    loading,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    refetch: fetchProdutos,
    bebidas: getBebidas(),
    tatuagens: getTatuagens()
  };
};
