import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, FinancialSummary } from '@/types/financial';

interface FinancialChartsProps {
  transactions: Transaction[];
  summary: FinancialSummary;
}

const COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4',
  '#84cc16', '#f97316', '#ec4899', '#6366f1', '#14b8a6', '#a855f7'
];

export const FinancialCharts = ({ transactions, summary }: FinancialChartsProps) => {
  // Dados para gráfico de pizza por categoria
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.categoria;
    const existing = acc.find(item => item.name === category);
    
    if (existing) {
      existing.value += transaction.valor;
    } else {
      acc.push({
        name: category,
        value: transaction.valor
      });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);

  // Dados para gráfico de barras essencial vs não essencial
  const essentialData = [
    {
      name: 'Essencial',
      value: summary.gastoEssencial,
      color: '#10b981'
    },
    {
      name: 'Não Essencial',
      value: summary.gastoNaoEssencial,
      color: '#f59e0b'
    }
  ];

  // Dados para gráfico por tipo de pagamento
  const paymentData = transactions.reduce((acc, transaction) => {
    const payment = transaction.tipoPagamento;
    const existing = acc.find(item => item.name === payment);
    
    if (existing) {
      existing.value += transaction.valor;
    } else {
      acc.push({
        name: payment,
        value: transaction.valor
      });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);

  // Dados para gráfico por especificação
  const specificationData = transactions.reduce((acc, transaction) => {
    const spec = transaction.especificacao;
    const existing = acc.find(item => item.name === spec);
    
    if (existing) {
      existing.value += transaction.valor;
    } else {
      acc.push({
        name: spec,
        value: transaction.valor
      });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <Card className="bg-card shadow-medium border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Gráficos Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              Adicione transações para ver os gráficos! 📊
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza - Categorias */}
      <Card className="bg-card shadow-medium border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🍰 Gastos por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Essencial vs Não Essencial */}
      <Card className="bg-card shadow-medium border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Essencial vs Não Essencial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={essentialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8">
                {essentialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Tipos de Pagamento */}
      <Card className="bg-card shadow-medium border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💳 Gastos por Tipo de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Especificações */}
      <Card className="bg-card shadow-medium border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Gastos por Especificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={specificationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};