
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package } from "lucide-react";

const mockProdutos = [
  {
    id: 1,
    nome: "Coca-Cola 350ml",
    preco: 5.50,
    estoque: 24,
    imagem: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nome: "Água 500ml",
    preco: 3.00,
    estoque: 18,
    imagem: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nome: "Suco Natural 300ml",
    preco: 8.00,
    estoque: 12,
    imagem: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nome: "Cerveja Artesanal",
    preco: 12.00,
    estoque: 6,
    imagem: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    nome: "Energético 250ml",
    preco: 7.50,
    estoque: 8,
    imagem: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    nome: "Café Expresso",
    preco: 4.00,
    estoque: 30,
    imagem: "/placeholder.svg?height=40&width=40",
  },
];

export const EstoquePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProdutos = mockProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstoqueStatus = (estoque: number) => {
    if (estoque <= 5) return { color: "bg-red-600", text: "Baixo" };
    if (estoque <= 15) return { color: "bg-yellow-600", text: "Médio" };
    return { color: "bg-green-600", text: "Alto" };
  };

  return (
    <div className="space-y-6">
      {/* Header com busca e ações */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package size={20} />
              <span>Gestão de Estoque</span>
            </div>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus size={16} className="mr-2" />
              Adicionar Bebida
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Buscar bebida"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Produtos</p>
                <p className="text-2xl font-bold text-white">{mockProdutos.length}</p>
              </div>
              <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Estoque Total</p>
                <p className="text-2xl font-bold text-white">
                  {mockProdutos.reduce((acc, produto) => acc + produto.estoque, 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-green-400" />
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
                  {mockProdutos.filter(p => p.estoque <= 5).length}
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
                  R$ {mockProdutos.reduce((acc, produto) => acc + (produto.preco * produto.estoque), 0).toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de produtos */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Produtos em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Imagem</TableHead>
                <TableHead className="text-slate-400">Nome</TableHead>
                <TableHead className="text-slate-400">Preço</TableHead>
                <TableHead className="text-slate-400">Estoque</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Valor Total</TableHead>
                <TableHead className="text-slate-400">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => {
                const status = getEstoqueStatus(produto.estoque);
                return (
                  <TableRow key={produto.id} className="border-slate-700">
                    <TableCell>
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-700"
                      />
                    </TableCell>
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
                        <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white">
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white">
                          Remover
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
    </div>
  );
};
