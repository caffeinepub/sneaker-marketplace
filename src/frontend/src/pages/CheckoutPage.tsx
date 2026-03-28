import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, LogIn, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../CartContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRouter } from "../router";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { navigate } = useRouter();
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const isAuthenticated = !!identity;

  const handlePlaceOrder = async () => {
    if (!actor || !isAuthenticated) return;
    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        sneakerId: item.sneakerId,
        size: item.size,
        quantity: BigInt(item.quantity),
      }));
      const id = await actor.placeOrder(orderItems, BigInt(cartTotal));
      setOrderId(id);
      clearCart();
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (orderId !== null) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-20 text-center"
        data-ocid="checkout.success_state"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 rounded-full bg-neon/10 border border-neon flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-neon" />
          </div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">
            ORDER CONFIRMED!
          </h1>
          <p className="text-muted-foreground">
            Your order #{String(orderId)} has been placed successfully.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              className="bg-neon text-background font-bold tracking-widest"
              onClick={() => navigate("/orders")}
              data-ocid="checkout.primary_button"
            >
              VIEW ORDERS
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-border"
              onClick={() => navigate("/shop")}
              data-ocid="checkout.secondary_button"
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-20 text-center"
        data-ocid="checkout.empty_state"
      >
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
        <h2 className="font-display font-bold text-xl tracking-wider mb-2">
          YOUR CART IS EMPTY
        </h2>
        <p className="text-muted-foreground mb-6">
          Add some sneakers before checking out.
        </p>
        <Button
          type="button"
          className="bg-neon text-background font-bold tracking-widest"
          onClick={() => navigate("/shop")}
          data-ocid="checkout.primary_button"
        >
          SHOP NOW
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight mb-8">
        CHECKOUT
      </h1>

      <div className="space-y-4 mb-6" data-ocid="checkout.list">
        {items.map((item, i) => (
          <div
            key={`${String(item.sneakerId)}-${item.size}`}
            className="flex items-center gap-4 bg-card rounded-lg p-4 border border-border"
            data-ocid={`checkout.item.${i + 1}`}
          >
            <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.name}</p>
              <p className="text-muted-foreground text-sm">
                {item.brand} · Size {item.size} · Qty {item.quantity}
              </p>
            </div>
            <p className="font-bold text-neon flex-shrink-0">
              ${((Number(item.price) * item.quantity) / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${(cartTotal / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-neon">FREE</span>
        </div>
        <Separator className="bg-border" />
        <div className="flex justify-between font-display font-bold text-lg">
          <span>TOTAL</span>
          <span className="text-neon">${(cartTotal / 100).toFixed(2)}</span>
        </div>

        {!isAuthenticated ? (
          <div className="pt-2 space-y-3" data-ocid="checkout.panel">
            <p className="text-muted-foreground text-sm text-center">
              Please log in to place your order.
            </p>
            <Button
              type="button"
              className="w-full bg-neon text-background font-bold tracking-widest"
              onClick={login}
              data-ocid="checkout.primary_button"
            >
              <LogIn className="mr-2 h-4 w-4" />
              LOGIN TO CHECKOUT
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="w-full bg-neon text-background font-bold tracking-widest text-base uppercase hover:bg-neon/90 hover:shadow-neon transition-all mt-2"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={placing}
            data-ocid="checkout.submit_button"
          >
            {placing ? "PLACING ORDER..." : "PLACE ORDER"}
          </Button>
        )}
      </div>
    </div>
  );
}
