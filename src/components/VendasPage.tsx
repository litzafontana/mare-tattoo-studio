
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const mockProdutos = [
  {
    id: 1,
    nome: "Coca-Cola 350ml",
    preco: 5.50,
    estoque: 24,
    imagem: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    nome: "Água 500ml",
    preco: 3.00,
    estoque: 18,
    imagem: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    nome: "Suco Natural 300ml",
    preco: 8.00,
    estoque: 12,
    imagem: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    nome: "Cerveja Artesanal",
    preco: 12.00,
    estoque: 6,
    imagem: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    nome: "Energético 250ml",
    preco: 7.50,
    estoque: 8,
    imagem: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    nome: "Café Expresso",
    preco: 4.00,
    estoque: 30,
    imagem: "/placeholder.svg?height=60&width=60",
  },
];

interface ItemVenda {
  produto: typeof mockProdutos[0];
  quantidade: number;
}

export const VendasPage = () => {
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);

  const adicionarAoCarrinho = (produto: typeof mockProdutos[0]) => {
    const itemExistente = carrinho.find(item => item.produto.id === produto.id);
    
    if (itemExistente) {
      if (itemExistente.quantidade < produto.estoque) {
        setCarrinho(carrinho.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        ));
      } else {
        toast({
          title: "Estoque insuficiente",
          description: "Não há estoque suficiente para este produto.",
          variant: "destructive",
        });
      }
    } else {
      setCarrinho([...carrinho, { produto, quantidade: 1 }]);
    }
  };

  const alterarQuantidade = (produtoId: number, novaQuantidade: number) => {
    const produto = mockProdutos.find(p => p.id === produtoId);
    
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }
    
    if (produto && novaQuantidade > produto.estoque) {
      toast({
        title: "Estoque insuficiente",
        description: "Não há estoque suficiente para esta quantidade.",
        variant: "destructive",
      });
      return;
    }

    setCarrinho(carrinho.map(item =>
      item.produto.id === produtoId
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
  };

  const confirmarVenda = () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de confirmar a venda.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Venda confirmada!",
      description: `Venda de R$ ${calcularTotal().toFixed(2)} realizada com sucesso.`,
    });
    
    setCarrinho([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de produtos */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <ShoppingCart size={20} />
              <span>Produtos Disponíveis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProdutos.map((produto) => (
                <Card key={produto.id} className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-600"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{produto.nome}</h3>
                        <p className="text-cyan-400 font-bold">R$ {produto.preco.toFixed(2)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant={produto.estoque <= 5 ? "destructive" : "default"}>
                            {produto.estoque} em estoque
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => adicionarAoCarrinho(produto)}
                            disabled={produto.estoque === 0}
                            className="bg-cyan-600 hover:bg-cyan-700"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carrinho */}
      <div className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Carrinho de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {carrinho.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">Carrinho vazio</p>
                <p className="text-sm text-slate-500">Adicione produtos para começar a venda</p>
              </div>
            ) : (
              <>
                {carrinho.map((item) => (
                  <div key={item.produto.id} className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{item.produto.nome}</h4>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removerDoCarrinho(item.produto.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                          className="w-8 h-8 p-0 bg-slate-600 border-slate-500"
                        >
                          <Minus size={12} />
                        </Button>
                        
                        <Input 
                          type="number" 
                          value={item.quantidade}
                          onChange={(e) => alterarQuantidade(item.produto.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center bg-slate-600 border-slate-500 text-white"
                          min="1"
                          max={item.produto.estoque}
                        />
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                          className="w-8 h-8 p-0 bg-slate-600 border-slate-500"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                      
                      <p className="text-cyan-400 font-bold">
                        R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-cyan-400 font-bold text-xl">
                      R$ {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={confirmarVenda}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                  >
                    Confirmar Venda
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
