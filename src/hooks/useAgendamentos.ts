
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Agendamento {
  id: string;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  tatuador?: string;
  status: string;
  google_event_id?: string;
  cor: string;
  created_at: string;
}

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgendamentos = async () => {
    try {
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .order("data_inicio", { ascending: true });

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const criarAgendamento = async (agendamento: Omit<Agendamento, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("agendamentos")
        .insert([agendamento])
        .select()
        .single();

      if (error) throw error;

      setAgendamentos(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const atualizarAgendamento = async (id: string, updates: Partial<Agendamento>) => {
    try {
      const { error } = await supabase
        .from("agendamentos")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setAgendamentos(prev =>
        prev.map(agendamento =>
          agendamento.id === id ? { ...agendamento, ...updates } : agendamento
        )
      );

      toast({
        title: "Sucesso",
        description: "Agendamento atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar agendamento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const excluirAgendamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from("agendamentos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id));
      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir agendamento",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  return {
    agendamentos,
    loading,
    criarAgendamento,
    atualizarAgendamento,
    excluirAgendamento,
    refetch: fetchAgendamentos,
  };
};
