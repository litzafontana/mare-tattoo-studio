
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useProdutos } from "@/hooks/useProdutos";
import { useVendas, ItemVenda } from "@/hooks/useVendas";
import { toast } from "@/hooks/use-toast";

export const VendasPage = () => {
  const { produtos, loading: loadingProdutos } = useProdutos();
  const { criarVenda, loading: loadingVendas } = useVendas();
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);

  const adicionarAoCarrinho = (produto: any) => {
    const itemExistente = carrinho.find(item => item.produto_id === produto.id);
    
    if (itemExistente) {
      if (itemExistente.quantidade < produto.estoque) {
        setCarrinho(carrinho.map(item =>
          item.produto_id === produto.id
            ? { 
                ...item, 
                quantidade: item.quantidade + 1,
                subtotal: item.preco_unitario * (item.quantidade + 1)
              }
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
      const novoItem: ItemVenda = {
        produto_id: produto.id,
        quantidade: 1,
        preco_unitario: produto.preco,
        subtotal: produto.preco
      };
      setCarrinho([...carrinho, novoItem]);
    }
  };

  const alterarQuantidade = (produtoId: string, novaQuantidade: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    
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
      item.produto_id === produtoId
        ? { 
            ...item, 
            quantidade: novaQuantidade,
            subtotal: item.preco_unitario * novaQuantidade
          }
        : item
    ));
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(carrinho.filter(item => item.produto_id !== produtoId));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.subtotal, 0);
  };

  const confirmarVenda = async () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de confirmar a venda.",
        variant: "destructive",
      });
      return;
    }

    try {
      await criarVenda(carrinho);
      setCarrinho([]);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  if (loadingProdutos) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              {produtos.map((produto) => (
                <Card key={produto.id} className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center">
                        <ShoppingCart size={24} className="text-slate-400" />
                      </div>
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
                {carrinho.map((item) => {
                  const produto = produtos.find(p => p.id === item.produto_id);
                  if (!produto) return null;
                  
                  return (
                    <div key={item.produto_id} className="bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{produto.nome}</h4>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removerDoCarrinho(item.produto_id)}
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
                            onClick={() => alterarQuantidade(item.produto_id, item.quantidade - 1)}
                            className="w-8 h-8 p-0 bg-slate-600 border-slate-500"
                          >
                            <Minus size={12} />
                          </Button>
                          
                          <Input 
                            type="number" 
                            value={item.quantidade}
                            onChange={(e) => alterarQuantidade(item.produto_id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center bg-slate-600 border-slate-500 text-white"
                            min="1"
                            max={produto.estoque}
                          />
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => alterarQuantidade(item.produto_id, item.quantidade + 1)}
                            className="w-8 h-8 p-0 bg-slate-600 border-slate-500"
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                        
                        <p className="text-cyan-400 font-bold">
                          R$ {item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-cyan-400 font-bold text-xl">
                      R$ {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={confirmarVenda}
                    disabled={loadingVendas}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                  >
                    {loadingVendas ? 'Processando...' : 'Confirmar Venda'}
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
