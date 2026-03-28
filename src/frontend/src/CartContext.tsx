import { type ReactNode, createContext, useContext, useState } from "react";

export interface CartItem {
  sneakerId: bigint;
  name: string;
  brand: string;
  price: bigint;
  size: string;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (sneakerId: bigint, size: string) => void;
  updateQuantity: (sneakerId: bigint, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.sneakerId === item.sneakerId && i.size === item.size,
      );
      if (existing) {
        return prev.map((i) =>
          i.sneakerId === item.sneakerId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (sneakerId: bigint, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.sneakerId === sneakerId && i.size === size)),
    );
  };

  const updateQuantity = (
    sneakerId: bigint,
    size: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(sneakerId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.sneakerId === sneakerId && i.size === size ? { ...i, quantity } : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = items.reduce(
    (acc, i) => acc + Number(i.price) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
