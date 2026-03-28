import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../CartContext";
import { useRouter } from "../router";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isOpen,
    setIsOpen,
  } = useCart();
  const { navigate } = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-card border-border flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-display tracking-wider text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neon" />
            YOUR CART
            {items.length > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p className="text-sm tracking-wider uppercase">
              Your cart is empty
            </p>
            <Button
              variant="outline"
              className="border-neon text-neon hover:bg-neon hover:text-background"
              onClick={() => setIsOpen(false)}
              data-ocid="cart.secondary_button"
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${String(item.sneakerId)}-${item.size}`}
                    className="flex gap-3"
                    data-ocid={`cart.item.${index + 1}`}
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.brand}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Size: {item.size}
                      </p>
                      <p className="text-neon font-bold text-sm mt-1">
                        ${(Number(item.price) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          removeFromCart(item.sneakerId, item.size)
                        }
                        data-ocid={`cart.delete_button.${index + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-border"
                          onClick={() =>
                            updateQuantity(
                              item.sneakerId,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-border"
                          onClick={() =>
                            updateQuantity(
                              item.sneakerId,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 pb-6 pt-4 border-t border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">
                  ${(cartTotal / 100).toFixed(2)}
                </span>
              </div>
              <Separator className="bg-border" />
              <Button
                className="w-full bg-neon text-background font-bold tracking-widest hover:bg-neon/90 uppercase"
                onClick={handleCheckout}
                data-ocid="cart.primary_button"
              >
                CHECKOUT
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground tracking-wider text-sm"
                onClick={() => setIsOpen(false)}
                data-ocid="cart.secondary_button"
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
