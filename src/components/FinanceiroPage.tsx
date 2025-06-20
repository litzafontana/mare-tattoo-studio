
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Download, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useFinanceiro } from "@/hooks/useFinanceiro";

export const FinanceiroPage = () => {
  const { transacoes, loading, adicionarTransacao, calcularResumo } = useFinanceiro();
  const [selectedTatuador, setSelectedTatuador] = useState("Todos");
  const [selectedCategoria, setSelectedCategoria] = useState("Todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    descricao: "",
    tatuador: "",
    tipo: "Receita" as "Receita" | "Despesa",
    valor: "",
    categoria: ""
  });

  const resumo = calcularResumo();

  const filteredTransacoes = transacoes.filter(transacao => {
    const matchTatuador = selectedTatuador === "Todos" || transacao.tatuador === selectedTatuador;
    const matchCategoria = selectedCategoria === "Todas" || transacao.categoria === selectedCategoria;
    return matchTatuador && matchCategoria;
  });

  // Dados para os gráficos
  const pieData = [
    { name: "Sessões", value: transacoes.filter(t => t.categoria === "Sessão").reduce((acc, t) => acc + t.valor, 0), color: "#06b6d4" },
    { name: "Bebidas", value: transacoes.filter(t => t.categoria === "Bebida").reduce((acc, t) => acc + t.valor, 0), color: "#8b5cf6" },
    { name: "Material", value: transacoes.filter(t => t.categoria === "Material").reduce((acc, t) => acc + t.valor, 0), color: "#ef4444" },
    { name: "Aluguel", value: transacoes.filter(t => t.categoria === "Aluguel").reduce((acc, t) => acc + t.valor, 0), color: "#f97316" },
  ].filter(item => item.value > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const transacaoData = {
      data: formData.data,
      descricao: formData.descricao,
      tatuador: formData.tatuador || undefined,
      tipo: formData.tipo,
      valor: parseFloat(formData.valor),
      categoria: formData.categoria
    };

    await adicionarTransacao(transacaoData);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      descricao: "",
      tatuador: "",
      tipo: "Receita",
      valor: "",
      categoria: ""
    });
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Receitas</p>
                <p className="text-2xl font-bold text-green-400">R$ {resumo.receitas.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Despesas</p>
                <p className="text-2xl font-bold text-red-400">R$ {resumo.despesas.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                <TrendingDown size={20} className="text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Saldo</p>
                <p className={`text-2xl font-bold ${resumo.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {resumo.saldo.toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Transações</p>
                <p className="text-2xl font-bold text-white">{transacoes.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <SelectItem value="Bebida">Bebida</SelectItem>
                  <SelectItem value="Aluguel">Aluguel</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 md:col-span-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                    <Plus size={16} className="mr-2" />
                    Novo Lançamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Transação</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="data">Data</Label>
                      <Input
                        id="data"
                        type="date"
                        value={formData.data}
                        onChange={(e) => setFormData({...formData, data: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tatuador">Tatuador (opcional)</Label>
                      <Input
                        id="tatuador"
                        value={formData.tatuador}
                        onChange={(e) => setFormData({...formData, tatuador: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select value={formData.tipo} onValueChange={(value: "Receita" | "Despesa") => setFormData({...formData, tipo: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="Receita">Receita</SelectItem>
                          <SelectItem value="Despesa">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={formData.valor}
                        onChange={(e) => setFormData({...formData, valor: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Input
                        id="categoria"
                        value={formData.categoria}
                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
                      Adicionar Transação
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="bg-slate-700 border-slate-600 text-white">
                <Download size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      {pieData.length > 0 && (
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
        </div>
      )}

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
              {filteredTransacoes.map((item) => (
                <TableRow key={item.id} className="border-slate-700">
                  <TableCell className="text-white">{new Date(item.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-white">{item.descricao}</TableCell>
                  <TableCell className="text-slate-400">{item.tatuador || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={item.tipo === "Receita" ? "default" : "destructive"}>
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className={item.tipo === "Receita" ? "text-green-400" : "text-red-400"}>
                    R$ {item.valor.toFixed(2)}
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
