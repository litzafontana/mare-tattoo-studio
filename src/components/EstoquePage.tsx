
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Package, Edit, Trash2, Coffee, Palette } from "lucide-react";
import { useProdutos } from "@/hooks/useProdutos";

export const EstoquePage = () => {
  const { produtos, loading, adicionarProduto, atualizarProduto, removerProduto, bebidas, tatuagens } = useProdutos();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("bebidas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    estoque: "",
    categoria: "bebida"
  });

  const filteredBebidas = bebidas.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTatuagens = tatuagens.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstoqueStatus = (estoque: number, categoria: string) => {
    if (categoria === 'tatuagem') {
      return { color: "bg-blue-600", text: "Serviço" };
    }
    if (estoque <= 5) return { color: "bg-red-600", text: "Baixo" };
    if (estoque <= 15) return { color: "bg-yellow-600", text: "Médio" };
    return { color: "bg-green-600", text: "Alto" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const produtoData = {
      nome: formData.nome,
      preco: parseFloat(formData.preco),
      estoque: formData.categoria === 'tatuagem' ? 999 : parseInt(formData.estoque),
      categoria: formData.categoria
    };

    if (editingProduct) {
      await atualizarProduto(editingProduct.id, produtoData);
    } else {
      await adicionarProduto(produtoData);
    }

    setFormData({ nome: "", preco: "", estoque: "", categoria: "bebida" });
    setEditingProduct(null);
    setDialogOpen(false);
  };

  const handleEdit = (produto: any) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      preco: produto.preco.toString(),
      estoque: produto.categoria === 'tatuagem' ? "" : produto.estoque.toString(),
      categoria: produto.categoria
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      await removerProduto(id);
    }
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
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package size={20} />
              <span>Gestão de Estoque</span>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({ nome: "", preco: "", estoque: "", categoria: "bebida" });
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Item' : 'Adicionar Novo Item'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="bebida">Bebida</SelectItem>
                        <SelectItem value="tatuagem">Serviço de Tatuagem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nome">{formData.categoria === 'tatuagem' ? 'Nome do Serviço' : 'Nome da Bebida'}</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder={formData.categoria === 'tatuagem' ? 'Ex: Tatuagem Pequena' : 'Ex: Coca-Cola 350ml'}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  {formData.categoria === 'bebida' && (
                    <div>
                      <Label htmlFor="estoque">Quantidade em Estoque</Label>
                      <Input
                        id="estoque"
                        type="number"
                        value={formData.estoque}
                        onChange={(e) => setFormData({...formData, estoque: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
                    {editingProduct ? 'Atualizar' : 'Adicionar'} {formData.categoria === 'tatuagem' ? 'Serviço' : 'Produto'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Buscar item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Bebidas</p>
                <p className="text-2xl font-bold text-white">{bebidas.length}</p>
              </div>
              <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Coffee size={20} className="text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Serviços Tatuagem</p>
                <p className="text-2xl font-bold text-white">{tatuagens.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Palette size={20} className="text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-400">
                  {bebidas.filter(p => p.estoque <= 5).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Valor Total</p>
                <p className="text-2xl font-bold text-white">
                  R$ {produtos.reduce((acc, produto) => {
                    return acc + (produto.categoria === 'tatuagem' ? produto.preco : produto.preco * produto.estoque);
                  }, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="bebidas" className="text-white data-[state=active]:bg-cyan-600">
            <Coffee size={16} className="mr-2" />
            Bebidas
          </TabsTrigger>
          <TabsTrigger value="tatuagens" className="text-white data-[state=active]:bg-purple-600">
            <Palette size={16} className="mr-2" />
            Serviços de Tatuagem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bebidas">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Bebidas em Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">Nome</TableHead>
                    <TableHead className="text-slate-400">Preço</TableHead>
                    <TableHead className="text-slate-400">Estoque</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Valor Total</TableHead>
                    <TableHead className="text-slate-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBebidas.map((produto) => {
                    const status = getEstoqueStatus(produto.estoque, produto.categoria);
                    return (
                      <TableRow key={produto.id} className="border-slate-700">
                        <TableCell className="text-white font-medium">{produto.nome}</TableCell>
                        <TableCell className="text-white">R$ {produto.preco.toFixed(2)}</TableCell>
                        <TableCell className="text-white">{produto.estoque} un</TableCell>
                        <TableCell>
                          <Badge className={`${status.color} text-white`}>
                            {status.text}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          R$ {(produto.preco * produto.estoque).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-slate-700 border-slate-600 text-white"
                              onClick={() => handleEdit(produto)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-slate-700 border-slate-600 text-red-400 hover:text-red-300"
                              onClick={() => handleDelete(produto.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tatuagens">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Serviços de Tatuagem</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">Serviço</TableHead>
                    <TableHead className="text-slate-400">Preço</TableHead>
                    <TableHead className="text-slate-400">Tipo</TableHead>
                    <TableHead className="text-slate-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTatuagens.map((produto) => {
                    const status = getEstoqueStatus(produto.estoque, produto.categoria);
                    return (
                      <TableRow key={produto.id} className="border-slate-700">
                        <TableCell className="text-white font-medium">{produto.nome}</TableCell>
                        <TableCell className="text-white">R$ {produto.preco.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={`${status.color} text-white`}>
                            {status.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-slate-700 border-slate-600 text-white"
                              onClick={() => handleEdit(produto)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-slate-700 border-slate-600 text-red-400 hover:text-red-300"
                              onClick={() => handleDelete(produto.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
