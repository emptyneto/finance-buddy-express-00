import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { TransactionTable } from './TransactionTable';
import { FinancialCharts } from './FinancialCharts';
import { AddTransactionDialog } from './AddTransactionDialog';
import { Transaction, FinancialSummary } from '@/types/financial';
import { useToast } from '@/hooks/use-toast';

export const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [receita, setReceita] = useState(5000); // Valor padrão de receita
  const { toast } = useToast();

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financialTransactions');
    const savedReceita = localStorage.getItem('financialReceita');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedReceita) {
      setReceita(parseFloat(savedReceita));
    }
  }, []);

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('financialTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financialReceita', receita.toString());
  }, [receita]);

  const calculateSummary = (): FinancialSummary => {
    const totalGasto = transactions.reduce((sum, t) => sum + t.valor, 0);
    const gastoEssencial = transactions.filter(t => t.tipo === 'Essencial').reduce((sum, t) => sum + t.valor, 0);
    const gastoNaoEssencial = transactions.filter(t => t.tipo === 'Não essencial').reduce((sum, t) => sum + t.valor, 0);
    const totalPago = transactions.filter(t => t.pago).reduce((sum, t) => sum + t.valor, 0);
    const totalNaoPago = transactions.filter(t => !t.pago).reduce((sum, t) => sum + t.valor, 0);
    const saldo = receita - totalGasto;

    return {
      totalGasto,
      gastoEssencial,
      gastoNaoEssencial,
      saldo,
      receita,
      totalPago,
      totalNaoPago
    };
  };

  const summary = calculateSummary();

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([...transactions, newTransaction]);
    toast({
      title: "Transação adicionada! 💰",
      description: "Nova movimentação registrada com sucesso.",
    });
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, ...updatedTransaction } : t
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transação removida! 🗑️",
      description: "Movimentação excluída com sucesso.",
    });
  };

  const getSaldoMessage = () => {
    if (summary.saldo > 0) return "Saldo positivo! 😎";
    if (summary.saldo < 0) return "Saldo negativo! 😬";
    return "Saldo zerado! 😐";
  };

  const getPagamentoMessage = () => {
    const allPaid = transactions.length > 0 && transactions.every(t => t.pago);
    const nonePaid = transactions.every(t => !t.pago);
    
    if (allPaid) return "Todas as compras pagas! ✅";
    if (nonePaid && transactions.length > 0) return "Nenhuma compra paga! ⚠️";
    return "Algumas compras pendentes! ⚠️";
  };

  const getMetaMessage = () => {
    const metaPercentage = (summary.gastoEssencial / summary.totalGasto) * 100;
    if (metaPercentage <= 70) return "Meta de gastos essenciais atingida! 🥳";
    return "Gastos essenciais acima da meta! 😱";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              💰 Controle Financeiro
            </h1>
            <p className="text-lg text-muted-foreground">
              Sua planilha inteligente e divertida
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
              <input
                type="number"
                value={receita}
                onChange={(e) => setReceita(parseFloat(e.target.value) || 0)}
                className="text-xl font-bold bg-transparent border-b-2 border-accent text-right w-32 text-foreground"
              />
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card shadow-medium border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {summary.totalGasto.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-medium border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                R$ {summary.saldo.toFixed(2)}
              </div>
              <p className="text-sm mt-1">{getSaldoMessage()}</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-medium border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Essencial vs Não Essencial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Essencial:</span>
                  <span className="font-semibold text-success">R$ {summary.gastoEssencial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Não essencial:</span>
                  <span className="font-semibold text-warning">R$ {summary.gastoNaoEssencial.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-medium border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Pago:</span>
                  <span className="font-semibold text-success">R$ {summary.totalPago.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pendente:</span>
                  <span className="font-semibold text-destructive">R$ {summary.totalNaoPago.toFixed(2)}</span>
                </div>
                <p className="text-xs mt-1">{getPagamentoMessage()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        <Card className="bg-primary shadow-medium border-border">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2">
                {summary.saldo >= 0 ? 
                  <TrendingUp className="h-5 w-5 text-primary-foreground" /> :
                  <TrendingDown className="h-5 w-5 text-primary-foreground" />
                }
                <span className="text-primary-foreground font-medium">{getSaldoMessage()}</span>
              </div>
              <div className="text-primary-foreground font-medium">
                {getPagamentoMessage()}
              </div>
              <div className="text-primary-foreground font-medium">
                {getMetaMessage()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <FinancialCharts transactions={transactions} summary={summary} />

        {/* Transaction Table */}
        <TransactionTable 
          transactions={transactions}
          onUpdate={updateTransaction}
          onDelete={deleteTransaction}
        />

        {/* Add Transaction Dialog */}
        <AddTransactionDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addTransaction}
        />
      </div>
    </div>
  );
};