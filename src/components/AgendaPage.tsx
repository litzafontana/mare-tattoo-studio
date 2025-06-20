import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, User, Phone, Mail, MapPin } from "lucide-react";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { CalendarView } from "./agenda/CalendarView";
import { AgendamentoDialog } from "./agenda/AgendamentoDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
export const AgendaPage = () => {
  const {
    agendamentos,
    loading,
    criarAgendamento,
    atualizarAgendamento,
    excluirAgendamento
  } = useAgendamentos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingAgendamento, setEditingAgendamento] = useState(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const agendamentosHoje = agendamentos.filter(agendamento => {
    const agendamentoDate = new Date(agendamento.data_inicio);
    const today = new Date();
    return agendamentoDate.toDateString() === today.toDateString();
  });
  const proximosAgendamentos = agendamentos.filter(agendamento => new Date(agendamento.data_inicio) > new Date()).slice(0, 5);
  const handleCreateAgendamento = () => {
    setEditingAgendamento(null);
    setDialogOpen(true);
  };
  const handleEditAgendamento = (agendamento: any) => {
    setEditingAgendamento(agendamento);
    setDialogOpen(true);
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Agenda</h2>
          <p className="text-slate-400">
            Gerencie seus agendamentos e integre com o Google Calendar
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'calendar' ? 'default' : 'outline'} onClick={() => setViewMode('calendar')} size="sm" className="text-slate-50 bg-gray-950 hover:bg-gray-800">
            <Calendar className="w-4 h-4 mr-2" />
            Calendário
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} size="sm" className="bg-slate-500 hover:bg-slate-400 text-gray-50">
            Lista
          </Button>
          <Button onClick={handleCreateAgendamento} className="bg-cyan-600 hover:bg-cyan-700 px-0 mx-0 font-normal">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Resumo do dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Hoje</p>
                <p className="text-2xl font-bold text-white">{agendamentosHoje.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Esta Semana</p>
                <p className="text-2xl font-bold text-white">
                  {agendamentos.filter(a => {
                  const date = new Date(a.data_inicio);
                  const now = new Date();
                  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return date >= now && date <= weekFromNow;
                }).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total</p>
                <p className="text-2xl font-bold text-white">{agendamentos.length}</p>
              </div>
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista principal */}
      {viewMode === 'calendar' ? <CalendarView agendamentos={agendamentos} selectedDate={selectedDate} onDateSelect={setSelectedDate} onEditAgendamento={handleEditAgendamento} onDeleteAgendamento={excluirAgendamento} /> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de agendamentos */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {proximosAgendamentos.length === 0 ? <p className="text-slate-400 text-center py-8">
                    Nenhum agendamento encontrado
                  </p> : proximosAgendamentos.map(agendamento => <div key={agendamento.id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer" onClick={() => handleEditAgendamento(agendamento)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full" style={{
                      backgroundColor: agendamento.cor
                    }} />
                            <h3 className="font-semibold text-white">{agendamento.titulo}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${agendamento.status === 'confirmado' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                              {agendamento.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {format(new Date(agendamento.data_inicio), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR
                      })}
                            </div>
                            {agendamento.cliente_nome && <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {agendamento.cliente_nome}
                              </div>}
                            {agendamento.tatuador && <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {agendamento.tatuador}
                              </div>}
                            {agendamento.cliente_telefone && <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {agendamento.cliente_telefone}
                              </div>}
                          </div>
                          
                          {agendamento.descricao && <p className="text-slate-300 mt-2 text-sm">{agendamento.descricao}</p>}
                        </div>
                      </div>
                    </div>)}
              </CardContent>
            </Card>
          </div>

          {/* Agendamentos de hoje */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                {agendamentosHoje.length === 0 ? <p className="text-slate-400 text-center py-4">
                    Nenhum agendamento para hoje
                  </p> : <div className="space-y-3">
                    {agendamentosHoje.map(agendamento => <div key={agendamento.id} className="bg-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => handleEditAgendamento(agendamento)}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{
                    backgroundColor: agendamento.cor
                  }} />
                          <h4 className="font-medium text-white text-sm">{agendamento.titulo}</h4>
                        </div>
                        <p className="text-xs text-slate-400">
                          {format(new Date(agendamento.data_inicio), "HH:mm", {
                    locale: ptBR
                  })} - {agendamento.cliente_nome}
                        </p>
                      </div>)}
                  </div>}
              </CardContent>
            </Card>
          </div>
        </div>}

      {/* Dialog para criar/editar agendamento */}
      <AgendamentoDialog open={dialogOpen} onOpenChange={setDialogOpen} agendamento={editingAgendamento} onSave={async data => {
      if (editingAgendamento) {
        await atualizarAgendamento(editingAgendamento.id, data);
      } else {
        await criarAgendamento(data);
      }
      setDialogOpen(false);
    }} />
    </div>;
};