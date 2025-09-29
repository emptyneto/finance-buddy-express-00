import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Transaction, ESPECIFICACOES, TIPOS, TIPOS_PAGAMENTO, CATEGORIAS } from '@/types/financial';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionDialog = ({ open, onOpenChange, onAdd }: AddTransactionDialogProps) => {
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    data: new Date().toISOString().split('T')[0],
    especificacao: 'Outros',
    tipo: 'Não essencial',
    tipoPagamento: 'Pix/Dinheiro',
    categoria: '🍔 Alimentação',
    valor: 0,
    pago: false,
    descricao: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.valor > 0) {
      onAdd(formData);
      // Reset form
      setFormData({
        data: new Date().toISOString().split('T')[0],
        especificacao: 'Outros',
        tipo: 'Não essencial',
        tipoPagamento: 'Pix/Dinheiro',
        categoria: '🍔 Alimentação',
        valor: 0,
        pago: false,
        descricao: ''
      });
      onOpenChange(false);
    }
  };

  const updateField = (field: keyof Omit<Transaction, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ➕ Nova Transação
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => updateField('data', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="especificacao">Especificação</Label>
            <Select value={formData.especificacao} onValueChange={(value) => updateField('especificacao', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESPECIFICACOES.map((spec) => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => updateField('tipo', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoPagamento">Tipo de Pagamento</Label>
              <Select value={formData.tipoPagamento} onValueChange={(value) => updateField('tipoPagamento', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_PAGAMENTO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={formData.categoria} onValueChange={(value) => updateField('categoria', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => updateField('valor', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pago"
              checked={formData.pago}
              onCheckedChange={(checked) => updateField('pago', checked)}
            />
            <Label htmlFor="pago">Já foi pago?</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => updateField('descricao', e.target.value)}
              placeholder="Descreva a transação..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={formData.valor <= 0}>
              Adicionar Transação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};