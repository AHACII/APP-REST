import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dish, CartItem, Order, Reservation, Category } from '../models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly DISHES_KEY = 'restaurant_dishes';
  private readonly ORDERS_KEY = 'restaurant_orders';
  private readonly RESERVATIONS_KEY = 'restaurant_reservations';
  private readonly CATEGORIES_KEY = 'restaurant_categories';
  private readonly CART_KEY = 'restaurant_cart';

  private defaultCategories: Category[] = [
    { id: 1, name: 'Entrées', icon: 'bi-egg-fried' },
    { id: 2, name: 'Plats principaux', icon: 'bi-cup-hot' },
    { id: 3, name: 'Desserts', icon: 'bi-cake2' },
    { id: 4, name: 'Boissons', icon: 'bi-cup-straw' }
  ];

  private defaultDishes: Dish[] = [
    {
      id: 1,
      name: 'Salade César',
      category: 'Entrées',
      description: 'Salade romaine, croûtons, parmesan et sauce César maison',
      price: 45,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
    },
    {
      id: 2,
      name: 'Soupe à l\'oignon',
      category: 'Entrées',
      description: 'Soupe traditionnelle gratinée au fromage',
      price: 35,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
    },
    {
      id: 3,
      name: 'Bruschetta',
      category: 'Entrées',
      description: 'Tomates fraîches, basilic et huile d\'olive sur pain grillé',
      price: 40,
      image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400'
    },
    {
      id: 4,
      name: 'Steak Frites',
      category: 'Plats principaux',
      description: 'Entrecôte grillée avec frites maison et sauce au poivre',
      price: 120,
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400'
    },
    {
      id: 5,
      name: 'Pizza Margherita',
      category: 'Plats principaux',
      description: 'Sauce tomate, mozzarella et basilic frais',
      price: 80,
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400'
    },
    {
      id: 6,
      name: 'Poulet Rôti',
      category: 'Plats principaux',
      description: 'Poulet fermier rôti aux herbes avec légumes de saison',
      price: 95,
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400'
    },
    {
      id: 7,
      name: 'Pâtes Carbonara',
      category: 'Plats principaux',
      description: 'Spaghetti à la crème, lardons et parmesan',
      price: 75,
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400'
    },
    {
      id: 8,
      name: 'Saumon Grillé',
      category: 'Plats principaux',
      description: 'Filet de saumon grillé, riz basmati et légumes verts',
      price: 110,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400'
    },
    {
      id: 9,
      name: 'Tiramisu',
      category: 'Desserts',
      description: 'Dessert italien au mascarpone et café',
      price: 45,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'
    },
    {
      id: 10,
      name: 'Crème Brûlée',
      category: 'Desserts',
      description: 'Crème vanille avec croûte de sucre caramélisé',
      price: 40,
      image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400'
    },
    {
      id: 11,
      name: 'Fondant au Chocolat',
      category: 'Desserts',
      description: 'Gâteau au chocolat au cœur coulant',
      price: 50,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'
    },
    {
      id: 12,
      name: 'Coca-Cola',
      category: 'Boissons',
      description: 'Boisson gazeuse classique (33cl)',
      price: 20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'
    },
    {
      id: 13,
      name: 'Jus d\'Orange',
      category: 'Boissons',
      description: 'Jus d\'orange fraîchement pressé',
      price: 25,
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400'
    },
    {
      id: 14,
      name: 'Eau Minérale',
      category: 'Boissons',
      description: 'Eau minérale naturelle (50cl)',
      price: 15,
      image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400'
    },
    {
      id: 15,
      name: 'Café Expresso',
      category: 'Boissons',
      description: 'Café italien traditionnel',
      price: 18,
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'
    }
  ];

  private dishesSubject = new BehaviorSubject<Dish[]>([]);
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private reservationsSubject = new BehaviorSubject<Reservation[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  dishes$ = this.dishesSubject.asObservable();
  cart$ = this.cartSubject.asObservable();
  orders$ = this.ordersSubject.asObservable();
  reservations$ = this.reservationsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const savedDishes = localStorage.getItem(this.DISHES_KEY);
    const savedOrders = localStorage.getItem(this.ORDERS_KEY);
    const savedReservations = localStorage.getItem(this.RESERVATIONS_KEY);
    const savedCategories = localStorage.getItem(this.CATEGORIES_KEY);
    const savedCart = localStorage.getItem(this.CART_KEY);

    if (savedDishes) {
      this.dishesSubject.next(JSON.parse(savedDishes));
    } else {
      this.dishesSubject.next(this.defaultDishes);
      this.saveDishes();
    }

    if (savedCategories) {
      this.categoriesSubject.next(JSON.parse(savedCategories));
    } else {
      this.categoriesSubject.next(this.defaultCategories);
      this.saveCategories();
    }

    if (savedOrders) {
      const orders = JSON.parse(savedOrders).map((o: any) => ({
        ...o,
        date: new Date(o.date)
      }));
      this.ordersSubject.next(orders);
    }

    if (savedReservations) {
      const reservations = JSON.parse(savedReservations).map((r: any) => ({
        ...r,
        date: new Date(r.date)
      }));
      this.reservationsSubject.next(reservations);
    }

    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveDishes(): void {
    localStorage.setItem(this.DISHES_KEY, JSON.stringify(this.dishesSubject.value));
  }

  private saveCategories(): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(this.categoriesSubject.value));
  }

  private saveOrders(): void {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(this.ordersSubject.value));
  }

  private saveReservations(): void {
    localStorage.setItem(this.RESERVATIONS_KEY, JSON.stringify(this.reservationsSubject.value));
  }

  private saveCart(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartSubject.value));
  }

  getDishes(): Dish[] {
    return this.dishesSubject.value;
  }

  getDishesByCategory(category: string): Dish[] {
    if (!category || category === 'all') {
      return this.dishesSubject.value;
    }
    return this.dishesSubject.value.filter(dish => dish.category === category);
  }

  searchDishes(query: string): Dish[] {
    const searchTerm = query.toLowerCase();
    return this.dishesSubject.value.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm) ||
      dish.description.toLowerCase().includes(searchTerm)
    );
  }

  addDish(dish: Omit<Dish, 'id'>): void {
    const dishes = this.dishesSubject.value;
    const newId = dishes.length > 0 ? Math.max(...dishes.map(d => d.id)) + 1 : 1;
    const newDish: Dish = { ...dish, id: newId };
    this.dishesSubject.next([...dishes, newDish]);
    this.saveDishes();
  }

  updateDish(dish: Dish): void {
    const dishes = this.dishesSubject.value.map(d => d.id === dish.id ? dish : d);
    this.dishesSubject.next(dishes);
    this.saveDishes();
  }

  deleteDish(id: number): void {
    const dishes = this.dishesSubject.value.filter(d => d.id !== id);
    this.dishesSubject.next(dishes);
    this.saveDishes();
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  addCategory(category: Omit<Category, 'id'>): void {
    const categories = this.categoriesSubject.value;
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const newCategory: Category = { ...category, id: newId };
    this.categoriesSubject.next([...categories, newCategory]);
    this.saveCategories();
  }

  updateCategory(category: Category): void {
    const categories = this.categoriesSubject.value.map(c => c.id === category.id ? category : c);
    this.categoriesSubject.next(categories);
    this.saveCategories();
  }

  deleteCategory(id: number): void {
    const categories = this.categoriesSubject.value.filter(c => c.id !== id);
    this.categoriesSubject.next(categories);
    this.saveCategories();
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  addToCart(dish: Dish): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.find(item => item.dish.id === dish.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartSubject.next([...cart]);
    } else {
      this.cartSubject.next([...cart, { dish, quantity: 1 }]);
    }
    this.saveCart();
  }

  updateCartItemQuantity(dishId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(dishId);
      return;
    }

    const cart = this.cartSubject.value.map(item =>
      item.dish.id === dishId ? { ...item, quantity } : item
    );
    this.cartSubject.next(cart);
    this.saveCart();
  }

  removeFromCart(dishId: number): void {
    const cart = this.cartSubject.value.filter(item => item.dish.id !== dishId);
    this.cartSubject.next(cart);
    this.saveCart();
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.saveCart();
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + item.dish.price * item.quantity, 0
    );
  }

  getCartItemCount(): number {
    return this.cartSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  getOrders(): Order[] {
    return this.ordersSubject.value;
  }

  addOrder(orderData: Omit<Order, 'id' | 'date' | 'status'>): Order {
    const orders = this.ordersSubject.value;
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      date: new Date(),
      status: 'confirmed'
    };
    this.ordersSubject.next([newOrder, ...orders]);
    this.saveOrders();
    this.clearCart();
    return newOrder;
  }

  updateOrderStatus(orderId: number, status: Order['status']): void {
    const orders = this.ordersSubject.value.map(o =>
      o.id === orderId ? { ...o, status } : o
    );
    this.ordersSubject.next(orders);
    this.saveOrders();
  }

  deleteOrder(id: number): void {
    const orders = this.ordersSubject.value.filter(o => o.id !== id);
    this.ordersSubject.next(orders);
    this.saveOrders();
  }

  getReservations(): Reservation[] {
    return this.reservationsSubject.value;
  }

  addReservation(reservationData: Omit<Reservation, 'id' | 'status'>): Reservation {
    const reservations = this.reservationsSubject.value;
    const newId = reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1 : 1;
    const newReservation: Reservation = {
      ...reservationData,
      id: newId,
      status: 'pending'
    };
    this.reservationsSubject.next([newReservation, ...reservations]);
    this.saveReservations();
    return newReservation;
  }

  updateReservationStatus(reservationId: number, status: Reservation['status']): void {
    const reservations = this.reservationsSubject.value.map(r =>
      r.id === reservationId ? { ...r, status } : r
    );
    this.reservationsSubject.next(reservations);
    this.saveReservations();
  }

  deleteReservation(id: number): void {
    const reservations = this.reservationsSubject.value.filter(r => r.id !== id);
    this.reservationsSubject.next(reservations);
    this.saveReservations();
  }
}
