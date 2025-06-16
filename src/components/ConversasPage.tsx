
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, User, Clock, RefreshCw, Tag } from "lucide-react";

const mockConversas = [
  {
    id: 1,
    cliente_nome: "Maria Silva",
    ultima_mensagem: "Oi! Gostaria de agendar uma sessão para semana que vem",
    status: "ativo",
    timestamp: "14:30",
    avatar: "MS",
  },
  {
    id: 2,
    cliente_nome: "João Santos",
    ultima_mensagem: "Quanto fica uma tatuagem pequena no pulso?",
    status: "pendente",
    timestamp: "12:15",
    avatar: "JS",
  },
  {
    id: 3,
    cliente_nome: "Ana Costa",
    ultima_mensagem: "Obrigada pelo atendimento! Ficou perfeito 😍",
    status: "finalizado",
    timestamp: "Ontem",
    avatar: "AC",
  },
  {
    id: 4,
    cliente_nome: "Pedro Lima",
    ultima_mensagem: "Pode me mandar mais algumas referências?",
    status: "ativo",
    timestamp: "10:45",
    avatar: "PL",
  },
];

const mockMensagens = [
  { id: 1, autor: "cliente", texto: "Oi! Gostaria de agendar uma sessão para semana que vem", timestamp: "14:25" },
  { id: 2, autor: "studio", texto: "Oi Maria! Que bom te ver aqui. Que tipo de tatuagem você tem em mente?", timestamp: "14:26" },
  { id: 3, autor: "cliente", texto: "Queria fazer uma mandala no ombro, algo delicado", timestamp: "14:28" },
  { id: 4, autor: "studio", texto: "Perfeito! A Ana faz trabalhos lindos com mandalas. Posso agendar para terça às 14h?", timestamp: "14:30" },
];

export const ConversasPage = () => {
  const [selectedConversa, setSelectedConversa] = useState(mockConversas[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-600";
      case "pendente": return "bg-yellow-600";
      case "finalizado": return "bg-gray-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Lista de conversas */}
      <Card className="bg-slate-800 border-slate-700 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>Conversas</span>
            </div>
            <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white">
              <RefreshCw size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Buscar cliente ou mensagem"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {mockConversas.map((conversa) => (
              <div
                key={conversa.id}
                onClick={() => setSelectedConversa(conversa)}
                className={`p-4 border-b border-slate-700 cursor-pointer transition-colors ${
                  selectedConversa.id === conversa.id ? "bg-slate-700" : "hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-medium">
                    {conversa.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium truncate">{conversa.cliente_nome}</h4>
                      <span className="text-xs text-slate-400">{conversa.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-400 truncate mb-2">{conversa.ultima_mensagem}</p>
                    <Badge className={`${getStatusColor(conversa.status)} text-white text-xs`}>
                      {conversa.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Painel de chat */}
      <Card className="bg-slate-800 border-slate-700 lg:col-span-2 flex flex-col">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-medium">
                {selectedConversa.avatar}
              </div>
              <div>
                <h3 className="text-white font-medium">{selectedConversa.cliente_nome}</h3>
                <p className="text-sm text-slate-400">Online há 5 min</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white">
                <Tag size={16} className="mr-1" />
                Tags
              </Button>
              <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white">
                <User size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {mockMensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex ${mensagem.autor === "studio" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    mensagem.autor === "studio"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  <p className="text-sm">{mensagem.texto}</p>
                  <p className="text-xs opacity-75 mt-1">{mensagem.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de nova mensagem */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-slate-700 border-slate-600 text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    console.log("Enviando mensagem:", newMessage);
                    setNewMessage("");
                  }
                }}
              />
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                Enviar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
