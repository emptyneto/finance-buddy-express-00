import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { Transaction, ESPECIFICACOES, TIPOS, TIPOS_PAGAMENTO, CATEGORIAS } from '@/types/financial';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdate: (id: string, transaction: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}

interface EditingTransaction extends Transaction {
  isEditing: boolean;
}

export const TransactionTable = ({ transactions, onUpdate, onDelete }: TransactionTableProps) => {
  const [editingTransactions, setEditingTransactions] = useState<Record<string, EditingTransaction>>({});

  const startEditing = (transaction: Transaction) => {
    setEditingTransactions(prev => ({
      ...prev,
      [transaction.id]: { ...transaction, isEditing: true }
    }));
  };

  const cancelEditing = (id: string) => {
    setEditingTransactions(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const saveEditing = (id: string) => {
    const editedTransaction = editingTransactions[id];
    if (editedTransaction) {
      const { isEditing, ...transactionData } = editedTransaction;
      onUpdate(id, transactionData);
      cancelEditing(id);
    }
  };

  const getEditingValue = (id: string, field: keyof Transaction): any => {
    return editingTransactions[id]?.[field];
  };

  const getEditingStringValue = (id: string, field: keyof Transaction): string => {
    const value = editingTransactions[id]?.[field];
    return typeof value === 'string' ? value : '';
  };

  const getEditingNumberValue = (id: string, field: keyof Transaction): number => {
    const value = editingTransactions[id]?.[field];
    return typeof value === 'number' ? value : 0;
  };

  const getEditingBooleanValue = (id: string, field: keyof Transaction): boolean => {
    const value = editingTransactions[id]?.[field];
    return typeof value === 'boolean' ? value : false;
  };

  const updateEditingValue = (id: string, field: keyof Transaction, value: any) => {
    setEditingTransactions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (transactions.length === 0) {
    return (
        <Card className="bg-card shadow-medium border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Tabela de Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                Nenhuma transação registrada ainda! 📝
              </p>
              <p className="text-sm text-muted-foreground">
                Adicione sua primeira transação para começar a controlar suas finanças.
              </p>
            </div>
          </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-card shadow-medium border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Tabela de Transações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-foreground">Data</th>
                <th className="text-left p-4 font-semibold text-foreground">Especificação</th>
                <th className="text-left p-4 font-semibold text-foreground">Tipo</th>
                <th className="text-left p-4 font-semibold text-foreground">Pagamento</th>
                <th className="text-left p-4 font-semibold text-foreground">Categoria</th>
                <th className="text-left p-4 font-semibold text-foreground">Valor</th>
                <th className="text-left p-4 font-semibold text-foreground">Pago</th>
                <th className="text-left p-4 font-semibold text-foreground">Descrição</th>
                <th className="text-left p-4 font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const isEditing = editingTransactions[transaction.id]?.isEditing;
                
                return (
                  <tr key={transaction.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      {isEditing ? (
                        <Input
                          type="date"
                          value={getEditingStringValue(transaction.id, 'data') || transaction.data}
                          onChange={(e) => updateEditingValue(transaction.id, 'data', e.target.value)}
                          className="w-32"
                        />
                      ) : (
                        formatDate(transaction.data)
                      )}
                    </td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <Select
                          value={getEditingStringValue(transaction.id, 'especificacao') || transaction.especificacao}
                          onValueChange={(value) => updateEditingValue(transaction.id, 'especificacao', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ESPECIFICACOES.map((spec) => (
                              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">{transaction.especificacao}</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <Select
                          value={getEditingStringValue(transaction.id, 'tipo') || transaction.tipo}
                          onValueChange={(value) => updateEditingValue(transaction.id, 'tipo', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIPOS.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          transaction.tipo === 'Essencial' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                        }`}>
                          {transaction.tipo}
                        </span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <Select
                          value={getEditingStringValue(transaction.id, 'tipoPagamento') || transaction.tipoPagamento}
                          onValueChange={(value) => updateEditingValue(transaction.id, 'tipoPagamento', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIPOS_PAGAMENTO.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">{transaction.tipoPagamento}</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <Select
                          value={getEditingStringValue(transaction.id, 'categoria') || transaction.categoria}
                          onValueChange={(value) => updateEditingValue(transaction.id, 'categoria', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIAS.map((categoria) => (
                              <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">{transaction.categoria}</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={getEditingNumberValue(transaction.id, 'valor') || transaction.valor}
                          onChange={(e) => updateEditingValue(transaction.id, 'valor', parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      ) : (
                        <span className="font-semibold text-foreground">
                          {formatCurrency(transaction.valor)}
                        </span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <Checkbox
                        checked={isEditing ? getEditingBooleanValue(transaction.id, 'pago') : transaction.pago}
                        onCheckedChange={(checked) => {
                          if (isEditing) {
                            updateEditingValue(transaction.id, 'pago', checked);
                          } else {
                            onUpdate(transaction.id, { pago: checked as boolean });
                          }
                        }}
                      />
                    </td>
                    
                    <td className="p-4 max-w-48">
                      {isEditing ? (
                        <Input
                          value={getEditingStringValue(transaction.id, 'descricao') || transaction.descricao}
                          onChange={(e) => updateEditingValue(transaction.id, 'descricao', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <span className="text-sm truncate block">{transaction.descricao}</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => saveEditing(transaction.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelEditing(transaction.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(transaction)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDelete(transaction.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};