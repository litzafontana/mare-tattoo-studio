import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User, Phone, Edit, Trash2 } from "lucide-react";
import { Agendamento } from "@/hooks/useAgendamentos";
interface CalendarViewProps {
  agendamentos: Agendamento[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEditAgendamento: (agendamento: Agendamento) => void;
  onDeleteAgendamento: (id: string) => void;
}
export const CalendarView = ({
  agendamentos,
  selectedDate,
  onDateSelect,
  onEditAgendamento,
  onDeleteAgendamento
}: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const agendamentosDodia = agendamentos.filter(agendamento => isSameDay(new Date(agendamento.data_inicio), selectedDate));
  const diasComAgendamentos = agendamentos.map(agendamento => new Date(agendamento.data_inicio));
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {format(currentMonth, "MMMM yyyy", {
              locale: ptBR
            })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={date => date && onDateSelect(date)} month={currentMonth} onMonthChange={setCurrentMonth} locale={ptBR} modifiers={{
            hasEvents: diasComAgendamentos
          }} modifiersStyles={{
            hasEvents: {
              backgroundColor: '#0891b2',
              color: 'white',
              fontWeight: 'bold'
            }
          }} className="w-full bg-slate-600 px-0 mx-0 my-0 py-0 rounded-none" />
          </CardContent>
        </Card>
      </div>

      {/* Agendamentos do dia selecionado */}
      <div>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {format(selectedDate, "dd 'de' MMMM", {
              locale: ptBR
            })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agendamentosDodia.length === 0 ? <div className="text-center py-8">
                <p className="text-slate-400">Nenhum agendamento para este dia</p>
              </div> : <div className="space-y-4">
                {agendamentosDodia.sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime()).map(agendamento => <div key={agendamento.id} className="bg-slate-700 rounded-lg p-4 border-l-4" style={{
              borderLeftColor: agendamento.cor
            }}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">{agendamento.titulo}</h3>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => onEditAgendamento(agendamento)} className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => onDeleteAgendamento(agendamento.id)} className="h-6 w-6 p-0 text-slate-400 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4" />
                          {format(new Date(agendamento.data_inicio), "HH:mm", {
                    locale: ptBR
                  })} - 
                          {format(new Date(agendamento.data_fim), "HH:mm", {
                    locale: ptBR
                  })}
                        </div>

                        {agendamento.cliente_nome && <div className="flex items-center gap-2 text-slate-300">
                            <User className="w-4 h-4" />
                            {agendamento.cliente_nome}
                          </div>}

                        {agendamento.cliente_telefone && <div className="flex items-center gap-2 text-slate-300">
                            <Phone className="w-4 h-4" />
                            {agendamento.cliente_telefone}
                          </div>}

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${agendamento.status === 'confirmado' ? 'bg-green-900 text-green-300' : agendamento.status === 'cancelado' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                            {agendamento.status}
                          </span>
                          {agendamento.tatuador && <span className="text-slate-400">• {agendamento.tatuador}</span>}
                        </div>

                        {agendamento.descricao && <p className="text-slate-400 mt-2">{agendamento.descricao}</p>}
                      </div>
                    </div>)}
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
};