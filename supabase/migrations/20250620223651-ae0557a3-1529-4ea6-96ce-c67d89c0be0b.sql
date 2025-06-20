
-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  cliente_nome VARCHAR(255),
  cliente_email VARCHAR(255),
  cliente_telefone VARCHAR(20),
  tatuador VARCHAR(100),
  status VARCHAR(50) DEFAULT 'agendado',
  google_event_id VARCHAR(255) UNIQUE,
  cor VARCHAR(7) DEFAULT '#06b6d4'
);

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_inicio ON agendamentos(data_inicio);
CREATE INDEX IF NOT EXISTS idx_agendamentos_tatuador ON agendamentos(tatuador);
CREATE INDEX IF NOT EXISTS idx_agendamentos_google_event_id ON agendamentos(google_event_id);

-- Inserir dados de exemplo
INSERT INTO agendamentos (titulo, descricao, data_inicio, data_fim, cliente_nome, cliente_email, tatuador, status, cor) VALUES
('Tatuagem Dragão', 'Tatuagem de dragão no braço direito', '2025-01-02 10:00:00+00', '2025-01-02 13:00:00+00', 'João Silva', 'joao@email.com', 'Carlos', 'agendado', '#06b6d4'),
('Retoque Tribal', 'Retoque em tatuagem tribal existente', '2025-01-03 14:00:00+00', '2025-01-03 16:00:00+00', 'Maria Santos', 'maria@email.com', 'Ana', 'confirmado', '#10b981'),
('Consulta', 'Primeira consulta para novo cliente', '2025-01-04 09:00:00+00', '2025-01-04 10:00:00+00', 'Pedro Costa', 'pedro@email.com', 'Carlos', 'agendado', '#f59e0b');
