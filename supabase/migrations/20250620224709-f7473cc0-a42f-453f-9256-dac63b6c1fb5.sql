
-- Habilitar Row Level Security na tabela agendamentos
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que todos possam visualizar os agendamentos
-- (já que não temos autenticação implementada ainda)
CREATE POLICY "Permitir visualização de agendamentos" 
ON public.agendamentos 
FOR SELECT 
USING (true);

-- Criar política para permitir inserção de novos agendamentos
CREATE POLICY "Permitir inserção de agendamentos" 
ON public.agendamentos 
FOR INSERT 
WITH CHECK (true);

-- Criar política para permitir atualização de agendamentos
CREATE POLICY "Permitir atualização de agendamentos" 
ON public.agendamentos 
FOR UPDATE 
USING (true);

-- Criar política para permitir exclusão de agendamentos
CREATE POLICY "Permitir exclusão de agendamentos" 
ON public.agendamentos 
FOR DELETE 
USING (true);
