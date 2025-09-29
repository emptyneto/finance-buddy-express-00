export interface Transaction {
  id: string;
  data: string;
  especificacao: 'Gasto fixo' | 'Educação' | 'Investimento/Poupança' | 'Meta 1' | 'Meta 2' | 'Reserva de Emergência' | 'Urgência' | 'Outros';
  tipo: 'Essencial' | 'Não essencial';
  tipoPagamento: 'Crédito' | 'Débito' | 'Pix/Dinheiro' | 'Investimento';
  categoria: '🏋️ Academia' | '🍔 Alimentação' | '🚗 Uber' | '🛒 Mercado' | '💳 Parcela' | '💡 Contas' | '📺 Assinaturas' | '📚 Educação' | '💻 Eletrônicos' | '👗 Vestuário' | '🍽 Restaurante' | '🎮 Lazer';
  valor: number;
  pago: boolean;
  descricao: string;
}

export interface FinancialSummary {
  totalGasto: number;
  gastoEssencial: number;
  gastoNaoEssencial: number;
  saldo: number;
  receita: number;
  totalPago: number;
  totalNaoPago: number;
}

export const ESPECIFICACOES = [
  'Gasto fixo',
  'Educação',
  'Investimento/Poupança',
  'Meta 1',
  'Meta 2',
  'Reserva de Emergência',
  'Urgência',
  'Outros'
] as const;

export const TIPOS = ['Essencial', 'Não essencial'] as const;

export const TIPOS_PAGAMENTO = ['Crédito', 'Débito', 'Pix/Dinheiro', 'Investimento'] as const;

export const CATEGORIAS = [
  '🏋️ Academia',
  '🍔 Alimentação',
  '🚗 Uber',
  '🛒 Mercado',
  '💳 Parcela',
  '💡 Contas',
  '📺 Assinaturas',
  '📚 Educação',
  '💻 Eletrônicos',
  '👗 Vestuário',
  '🍽 Restaurante',
  '🎮 Lazer'
] as const;