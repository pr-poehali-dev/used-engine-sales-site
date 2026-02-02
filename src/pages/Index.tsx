import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import Cart from '@/components/Cart';
import { useToast } from '@/hooks/use-toast';

interface Engine {
  id: number;
  brand: string;
  model: string;
  volume: string;
  power: string;
  year: string;
  price: string;
  condition: string;
  mileage: string;
  guarantee: string;
}

const engines: Engine[] = [
  { id: 1, brand: 'Toyota', model: 'Camry 2.5', volume: '2.5л', power: '181 л.с.', year: '2018-2021', price: '185 000', condition: 'Отличное', mileage: '45 000 км', guarantee: '6 месяцев' },
  { id: 2, brand: 'BMW', model: 'X5 3.0d', volume: '3.0л', power: '249 л.с.', year: '2017-2020', price: '320 000', condition: 'Хорошее', mileage: '78 000 км', guarantee: '6 месяцев' },
  { id: 3, brand: 'Mercedes', model: 'E200 2.0T', volume: '2.0л', power: '184 л.с.', year: '2019-2022', price: '295 000', condition: 'Отличное', mileage: '52 000 км', guarantee: '12 месяцев' },
  { id: 4, brand: 'Volkswagen', model: 'Tiguan 2.0', volume: '2.0л', power: '180 л.с.', year: '2016-2019', price: '155 000', condition: 'Хорошее', mileage: '89 000 км', guarantee: '6 месяцев' },
  { id: 5, brand: 'Audi', model: 'A4 2.0 TFSI', volume: '2.0л', power: '190 л.с.', year: '2018-2021', price: '215 000', condition: 'Отличное', mileage: '61 000 км', guarantee: '12 месяцев' },
  { id: 6, brand: 'Honda', model: 'CR-V 2.4', volume: '2.4л', power: '190 л.с.', year: '2015-2018', price: '145 000', condition: 'Хорошее', mileage: '95 000 км', guarantee: '6 месяцев' },
];

interface CartItem {
  id: number;
  brand: string;
  model: string;
  volume: string;
  price: string;
  quantity: number;
}

export default function Index() {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedVolume, setSelectedVolume] = useState<string>('all');
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const brands = ['all', ...Array.from(new Set(engines.map(e => e.brand)))];
  const volumes = ['all', ...Array.from(new Set(engines.map(e => e.volume)))];

  const filteredEngines = engines.filter(engine => {
    if (selectedBrand !== 'all' && engine.brand !== selectedBrand) return false;
    if (selectedVolume !== 'all' && engine.volume !== selectedVolume) return false;
    return true;
  });

  const toggleCompare = (id: number) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(item => item !== id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, id]);
    }
  };

  const comparedEngines = engines.filter(e => compareList.includes(e.id));

  const addToCart = (engine: Engine) => {
    const existingItem = cartItems.find(item => item.id === engine.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === engine.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      toast({
        title: 'Количество обновлено',
        description: `${engine.brand} ${engine.model} — теперь ${existingItem.quantity + 1} шт. в корзине`,
      });
    } else {
      setCartItems([...cartItems, {
        id: engine.id,
        brand: engine.brand,
        model: engine.model,
        volume: engine.volume,
        price: engine.price,
        quantity: 1
      }]);
      toast({
        title: 'Добавлено в корзину',
        description: `${engine.brand} ${engine.model}`,
      });
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: 'Удалено из корзины',
      variant: 'destructive',
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: 'Корзина очищена',
    });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Cog" className="text-primary" size={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MotorPro
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#catalog" className="hover:text-primary transition-colors">Каталог</a>
            <a href="#guarantee" className="hover:text-primary transition-colors">Гарантия</a>
            <a href="#delivery" className="hover:text-primary transition-colors">Доставка</a>
            <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10 hidden sm:flex">
              <Icon name="Phone" size={18} className="mr-2" />
              +7 (999) 123-45-67
            </Button>
            <Cart 
              items={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
              onClear={clearCart}
            />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Качественные двигатели
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                с гарантией
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Большой выбор проверенных двигателей для всех марок автомобилей. 
              Доставка по всей России.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg group">
                Смотреть каталог
                <Icon name="ArrowRight" size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 text-lg">
                <Icon name="Phone" size={20} className="mr-2" />
                Позвонить
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Каталог двигателей</h2>
            <p className="text-muted-foreground text-lg">Найдите подходящий двигатель для вашего автомобиля</p>
          </div>

          <Card className="mb-8 border-primary/20 animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Filter" size={24} />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label>Марка автомобиля</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите марку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все марки</SelectItem>
                    {brands.filter(b => b !== 'all').map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Объём двигателя</Label>
                <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите объём" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все объёмы</SelectItem>
                    {volumes.filter(v => v !== 'all').map(volume => (
                      <SelectItem key={volume} value={volume}>{volume}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {compareList.length > 0 && (
            <div className="mb-8 flex items-center justify-between p-4 bg-card border border-primary/30 rounded-lg animate-scale-in">
              <div className="flex items-center gap-2">
                <Icon name="GitCompare" className="text-primary" size={24} />
                <span className="font-semibold">Выбрано для сравнения: {compareList.length}/3</span>
              </div>
              <Button onClick={() => setShowComparison(true)} disabled={compareList.length < 2}>
                Сравнить
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngines.map((engine, index) => (
              <Card 
                key={engine.id} 
                className="hover:shadow-lg hover:border-primary/40 transition-all duration-300 hover:scale-105 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {engine.brand}
                      </CardTitle>
                      <CardDescription className="text-base mt-1">{engine.model}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      {engine.volume}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Gauge" size={16} className="text-muted-foreground" />
                      <span>Мощность: {engine.power}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span>Год: {engine.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Activity" size={16} className="text-muted-foreground" />
                      <span>Пробег: {engine.mileage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="ShieldCheck" size={16} className="text-primary" />
                      <span className="text-primary font-medium">Гарантия {engine.guarantee}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-2xl font-bold text-primary">
                      {engine.price} ₽
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    onClick={() => addToCart(engine)}
                  >
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    Купить
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleCompare(engine.id)}
                    className={compareList.includes(engine.id) ? 'border-primary bg-primary/10' : ''}
                  >
                    <Icon name="GitCompare" size={18} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="guarantee" className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Гарантия качества</h2>
            <p className="text-muted-foreground text-lg">Мы уверены в качестве наших двигателей</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="ShieldCheck" className="text-primary" size={32} />
                </div>
                <CardTitle>Гарантия до 12 месяцев</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Официальная гарантия на все двигатели с полной технической поддержкой
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-secondary/20 hover:border-secondary/40 transition-all">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Icon name="ClipboardCheck" className="text-secondary" size={32} />
                </div>
                <CardTitle>Проверка перед продажей</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Каждый двигатель проходит тщательную диагностику и тестирование
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="FileText" className="text-primary" size={32} />
                </div>
                <CardTitle>Полный пакет документов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Предоставляем все необходимые документы и историю обслуживания
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="delivery" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Доставка по всей России</h2>
              <p className="text-muted-foreground text-lg">Быстрая и надёжная транспортировка</p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="hover:text-primary">
                  <div className="flex items-center gap-3">
                    <Icon name="Truck" className="text-primary" size={24} />
                    <span className="font-semibold">Транспортной компанией</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Отправляем через проверенные ТК (СДЭК, Деловые Линии, ПЭК). Упаковка на европоддоне, защита от повреждений. Срок доставки 3-7 дней.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="hover:text-primary">
                  <div className="flex items-center gap-3">
                    <Icon name="CarFront" className="text-secondary" size={24} />
                    <span className="font-semibold">Собственной службой доставки</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Доставка нашим транспортом по Москве и Московской области. Установка на месте под ключ. Доставка в течение 1-2 дней.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="hover:text-primary">
                  <div className="flex items-center gap-3">
                    <Icon name="Package" className="text-primary" size={24} />
                    <span className="font-semibold">Самовывоз со склада</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Забрать двигатель можно со склада в Москве. Работаем ежедневно с 9:00 до 20:00. Помощь с погрузкой включена.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Свяжитесь с нами</h2>
              <p className="text-muted-foreground text-lg">Ответим на все вопросы и поможем с выбором</p>
            </div>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input id="name" placeholder="Иван Иванов" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                  </div>
                  <div>
                    <Label htmlFor="message">Сообщение</Label>
                    <Input id="message" placeholder="Интересует двигатель для Toyota Camry" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" className="text-primary" size={20} />
                    <span>+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" className="text-primary" size={20} />
                    <span>info@motorpro.ru</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="MapPin" className="text-primary" size={20} />
                    <span>г. Москва, ул. Автозаводская, д. 23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 MotorPro. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Icon name="GitCompare" className="text-primary" size={28} />
              Сравнение двигателей
            </DialogTitle>
            <DialogDescription>
              Сравните характеристики выбранных двигателей
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {comparedEngines.map(engine => (
              <Card key={engine.id} className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">{engine.brand} {engine.model}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Объём:</span>
                    <span className="font-semibold">{engine.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Мощность:</span>
                    <span className="font-semibold">{engine.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Год:</span>
                    <span className="font-semibold">{engine.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Пробег:</span>
                    <span className="font-semibold">{engine.mileage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Состояние:</span>
                    <span className="font-semibold">{engine.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Гарантия:</span>
                    <span className="font-semibold text-primary">{engine.guarantee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Цена:</span>
                    <span className="font-bold text-primary text-lg">{engine.price} ₽</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}