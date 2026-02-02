import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CartItem {
  id: number;
  brand: string;
  model: string;
  volume: string;
  price: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onClear: () => void;
}

export default function Cart({ items, onRemove, onUpdateQuantity, onClear }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: ''
  });

  const totalPrice = items.reduce((sum, item) => sum + parseInt(item.price.replace(/\s/g, '')) * item.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOrderForm(false);
    setIsOpen(false);
    setShowSuccess(true);
    onClear();
    setFormData({ name: '', phone: '', email: '', address: '', comment: '' });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative border-primary/50 hover:bg-primary/10">
            <Icon name="ShoppingCart" size={20} />
            {items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                {items.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <Icon name="ShoppingCart" className="text-primary" size={28} />
              Корзина
            </SheetTitle>
            <SheetDescription>
              {items.length === 0 ? 'Корзина пуста' : `Товаров в корзине: ${items.length}`}
            </SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Ваша корзина пуста</p>
              <Button onClick={() => setIsOpen(false)} className="mt-4" variant="outline">
                Перейти к каталогу
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.brand}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{item.model}</p>
                        <Badge variant="secondary" className="mt-2 bg-primary/20 text-primary">
                          {item.volume}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(item.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Icon name="Minus" size={14} />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {(parseInt(item.price.replace(/\s/g, '')) * item.quantity).toLocaleString('ru-RU')} ₽
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">
                            {item.price} ₽ × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator className="my-4" />

              <Card className="border-primary/30 bg-card/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Товаров:</span>
                      <span>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Стоимость:</span>
                      <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого:</span>
                      <span className="text-primary">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                  onClick={() => setShowOrderForm(true)}
                >
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Оформить заказ
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClear}
                >
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Очистить корзину
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Icon name="ClipboardList" className="text-primary" size={28} />
              Оформление заказа
            </DialogTitle>
            <DialogDescription>
              Заполните данные для доставки и оплаты
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitOrder} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="order-name">Имя и фамилия *</Label>
              <Input
                id="order-name"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="order-phone">Телефон *</Label>
              <Input
                id="order-phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="order-email">Email</Label>
              <Input
                id="order-email"
                type="email"
                placeholder="ivan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="order-address">Адрес доставки *</Label>
              <Input
                id="order-address"
                placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="order-comment">Комментарий к заказу</Label>
              <Input
                id="order-comment"
                placeholder="Доставка после 18:00"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>

            <Separator />

            <div className="bg-card/50 p-4 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Итого к оплате:</span>
                <span className="text-2xl font-bold text-primary">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              <Icon name="Check" size={20} className="mr-2" />
              Подтвердить заказ
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Icon name="CheckCircle2" className="text-primary" size={40} />
            </div>
            <DialogTitle className="text-center text-2xl">
              Заказ успешно оформлен!
            </DialogTitle>
            <DialogDescription className="text-center">
              Мы получили ваш заказ и свяжемся с вами в ближайшее время для подтверждения и уточнения деталей доставки.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Clock" size={16} className="text-primary" />
              <span>Обработка заказа занимает 15-30 минут</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Phone" size={16} className="text-primary" />
              <span>Наш менеджер позвонит вам для уточнения деталей</span>
            </div>
          </div>
          <Button
            onClick={() => setShowSuccess(false)}
            className="w-full mt-6"
            variant="outline"
          >
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
