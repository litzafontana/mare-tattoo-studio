
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Agendamento } from "@/hooks/useAgendamentos";
import { format } from "date-fns";

interface AgendamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agendamento?: Agendamento | null;
  onSave: (data: Omit<Agendamento, "id" | "created_at">) => Promise<void>;
}

const cores = [
  { value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
  { value: "#10b981", label: "Verde", color: "#10b981" },
  { value: "#f59e0b", label: "Amarelo", color: "#f59e0b" },
  { value: "#ef4444", label: "Vermelho", color: "#ef4444" },
  { value: "#8b5cf6", label: "Roxo", color: "#8b5cf6" },
  { value: "#f97316", label: "Laranja", color: "#f97316" },
];

const tatuadores = ["Carlos", "Ana", "Lucas", "Maria"];
const statusOptions = ["agendado", "confirmado", "em_andamento", "concluido", "cancelado"];

export const AgendamentoDialog = ({
  open,
  onOpenChange,
  agendamento,
  onSave,
}: AgendamentoDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    cliente_nome: "",
    cliente_email: "",
    cliente_telefone: "",
    tatuador: "",
    status: "agendado",
    cor: "#06b6d4",
    google_event_id: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agendamento) {
      setFormData({
        titulo: agendamento.titulo,
        descricao: agendamento.descricao || "",
        data_inicio: format(new Date(agendamento.data_inicio), "yyyy-MM-dd'T'HH:mm"),
        data_fim: format(new Date(agendamento.data_fim), "yyyy-MM-dd'T'HH:mm"),
        cliente_nome: agendamento.cliente_nome || "",
        cliente_email: agendamento.cliente_email || "",
        cliente_telefone: agendamento.cliente_telefone || "",
        tatuador: agendamento.tatuador || "",
        status: agendamento.status,
        cor: agendamento.cor,
        google_event_id: agendamento.google_event_id || "",
      });
    } else {
      // Reset form for new agendamento
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      setFormData({
        titulo: "",
        descricao: "",
        data_inicio: format(now, "yyyy-MM-dd'T'HH:mm"),
        data_fim: format(oneHourLater, "yyyy-MM-dd'T'HH:mm"),
        cliente_nome: "",
        cliente_email: "",
        cliente_telefone: "",
        tatuador: "",
        status: "agendado",
        cor: "#06b6d4",
        google_event_id: "",
      });
    }
  }, [agendamento, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        ...formData,
        data_inicio: new Date(formData.data_inicio).toISOString(),
        data_fim: new Date(formData.data_fim).toISOString(),
      });
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {agendamento ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titulo" className="text-white">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="cor" className="text-white">Cor</Label>
              <Select value={formData.cor} onValueChange={(value) => handleInputChange("cor", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {cores.map((cor) => (
                    <SelectItem key={cor.value} value={cor.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: cor.color }}
                        />
                        {cor.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao" className="text-white">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_inicio" className="text-white">Data/Hora Início *</Label>
              <Input
                id="data_inicio"
                type="datetime-local"
                value={formData.data_inicio}
                onChange={(e) => handleInputChange("data_inicio", e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="data_fim" className="text-white">Data/Hora Fim *</Label>
              <Input
                id="data_fim"
                type="datetime-local"
                value={formData.data_fim}
                onChange={(e) => handleInputChange("data_fim", e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente_nome" className="text-white">Nome do Cliente</Label>
              <Input
                id="cliente_nome"
                value={formData.cliente_nome}
                onChange={(e) => handleInputChange("cliente_nome", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="cliente_telefone" className="text-white">Telefone</Label>
              <Input
                id="cliente_telefone"
                value={formData.cliente_telefone}
                onChange={(e) => handleInputChange("cliente_telefone", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cliente_email" className="text-white">E-mail do Cliente</Label>
            <Input
              id="cliente_email"
              type="email"
              value={formData.cliente_email}
              onChange={(e) => handleInputChange("cliente_email", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tatuador" className="text-white">Tatuador</Label>
              <Select value={formData.tatuador} onValueChange={(value) => handleInputChange("tatuador", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione um tatuador" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {tatuadores.map((tatuador) => (
                    <SelectItem key={tatuador} value={tatuador}>
                      {tatuador}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="text-white">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
