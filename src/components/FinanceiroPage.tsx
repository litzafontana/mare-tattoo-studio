
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Download, Calendar } from "lucide-react";

const mockFinanceData = [
  { data: "2024-01-15", descricao: "Sessão de tatuagem", tatuador: "Ana", tipo: "Receita", valor: 450, categoria: "Sessão" },
  { data: "2024-01-15", descricao: "Sinal próxima sessão", tatuador: "Lucas", tipo: "Receita", valor: 100, categoria: "Sinal" },
  { data: "2024-01-14", descricao: "Bebidas vendidas", tatuador: "-", tipo: "Receita", valor: 65, categoria: "Bebida" },
  { data: "2024-01-14", descricao: "Material descartável", tatuador: "-", tipo: "Despesa", valor: -85, categoria: "Material" },
  { data: "2024-01-13", descricao: "Aluguel janeiro", tatuador: "-", tipo: "Despesa", valor: -800, categoria: "Aluguel" },
];

const pieData = [
  { name: "Sessões", value: 550, color: "#06b6d4" },
  { name: "Bebidas", value: 65, color: "#8b5cf6" },
  { name: "Material", value: 85, color: "#ef4444" },
  { name: "Aluguel", value: 800, color: "#f97316" },
];

const lineData = [
  { mes: "Nov", receita: 2400, despesa: 1200 },
  { mes: "Dez", receita: 3200, despesa: 1400 },
  { mes: "Jan", receita: 2800, despesa: 1600 },
];

export const FinanceiroPage = () => {
  const [selectedTatuador, setSelectedTatuador] = useState("Todos");
  const [selectedCategoria, setSelectedCategoria] = useState("Todas");

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar size={20} />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Período</label>
              <Button variant="outline" className="w-full bg-slate-700 border-slate-600 text-white">
                Janeiro 2024
              </Button>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Tatuador</label>
              <Select value={selectedTatuador} onValueChange={setSelectedTatuador}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Ana">Ana</SelectItem>
                  <SelectItem value="Lucas">Lucas</SelectItem>
                  <SelectItem value="João">João</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Categoria</label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="Sessão">Sessão</SelectItem>
                  <SelectItem value="Sinal">Sinal</SelectItem>
                  <SelectItem value="Produto">Produto</SelectItem>
                  <SelectItem value="Bebida">Bebida</SelectItem>
                  <SelectItem value="Aluguel">Aluguel</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                <Plus size={16} className="mr-2" />
                Novo Lançamento
              </Button>
              <Button variant="outline" className="bg-slate-700 border-slate-600 text-white">
                <Download size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Line type="monotone" dataKey="receita" stroke="#06b6d4" strokeWidth={3} />
                <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de lançamentos */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Lançamentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Data</TableHead>
                <TableHead className="text-slate-400">Descrição</TableHead>
                <TableHead className="text-slate-400">Tatuador</TableHead>
                <TableHead className="text-slate-400">Tipo</TableHead>
                <TableHead className="text-slate-400">Valor</TableHead>
                <TableHead className="text-slate-400">Categoria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFinanceData.map((item, index) => (
                <TableRow key={index} className="border-slate-700">
                  <TableCell className="text-white">{item.data}</TableCell>
                  <TableCell className="text-white">{item.descricao}</TableCell>
                  <TableCell className="text-slate-400">{item.tatuador}</TableCell>
                  <TableCell>
                    <Badge variant={item.tipo === "Receita" ? "default" : "destructive"}>
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className={item.valor > 0 ? "text-green-400" : "text-red-400"}>
                    R$ {Math.abs(item.valor).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-slate-400">{item.categoria}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
