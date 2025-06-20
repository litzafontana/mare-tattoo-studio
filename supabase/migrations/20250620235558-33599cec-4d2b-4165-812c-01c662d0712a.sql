
-- Adicionar coluna tatuador na tabela produtos
ALTER TABLE public.produtos 
ADD COLUMN tatuador VARCHAR(100);

-- Atualizar produtos de tatuagem existentes com um tatuador padrão
UPDATE public.produtos 
SET tatuador = 'Não especificado' 
WHERE categoria = 'tatuagem';
