
-- Tabela de produtos (bebidas e outros itens)
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0,
  imagem TEXT,
  categoria VARCHAR(100) DEFAULT 'bebida',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de transações financeiras
CREATE TABLE public.transacoes_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao VARCHAR(255) NOT NULL,
  tatuador VARCHAR(100),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Receita', 'Despesa')),
  valor DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de vendas
CREATE TABLE public.vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'concluida',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de itens da venda (relação entre vendas e produtos)
CREATE TABLE public.itens_venda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id UUID NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id),
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir alguns produtos de exemplo
INSERT INTO public.produtos (nome, preco, estoque, categoria) VALUES
('Coca-Cola 350ml', 5.50, 24, 'bebida'),
('Água 500ml', 3.00, 18, 'bebida'),
('Suco Natural 300ml', 8.00, 12, 'bebida'),
('Cerveja Artesanal', 12.00, 6, 'bebida'),
('Energético 250ml', 7.50, 8, 'bebida'),
('Café Expresso', 4.00, 30, 'bebida');

-- Inserir algumas transações financeiras de exemplo
INSERT INTO public.transacoes_financeiras (data, descricao, tatuador, tipo, valor, categoria) VALUES
('2024-01-15', 'Sessão de tatuagem', 'Ana', 'Receita', 450.00, 'Sessão'),
('2024-01-15', 'Sinal próxima sessão', 'Lucas', 'Receita', 100.00, 'Sinal'),
('2024-01-14', 'Bebidas vendidas', '', 'Receita', 65.00, 'Bebida'),
('2024-01-14', 'Material descartável', '', 'Despesa', 85.00, 'Material'),
('2024-01-13', 'Aluguel janeiro', '', 'Despesa', 800.00, 'Aluguel');

-- Habilitar Row Level Security (para permitir acesso público temporariamente)
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_venda ENABLE ROW LEVEL SECURITY;

-- Criar políticas que permitem acesso público (você pode restringir depois)
CREATE POLICY "Permitir acesso público aos produtos" ON public.produtos FOR ALL USING (true);
CREATE POLICY "Permitir acesso público às transações" ON public.transacoes_financeiras FOR ALL USING (true);
CREATE POLICY "Permitir acesso público às vendas" ON public.vendas FOR ALL USING (true);
CREATE POLICY "Permitir acesso público aos itens de venda" ON public.itens_venda FOR ALL USING (true);
