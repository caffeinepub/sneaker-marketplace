import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../CartContext";
import type { Sneaker } from "../backend";
import { useRouter } from "../router";

export default function SneakerCard({
  sneaker,
  index,
}: {
  sneaker: Sneaker;
  index: number;
}) {
  const { addToCart, setIsOpen } = useCart();
  const { navigate } = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const size = sneaker.sizes[0] ?? "10";
    addToCart({
      sneakerId: sneaker.id,
      name: sneaker.name,
      brand: sneaker.brand,
      price: sneaker.price,
      size,
      quantity: 1,
      imageUrl: sneaker.imageUrl,
    });
    toast.success(`${sneaker.name} added to cart`);
    setIsOpen(true);
  };

  return (
    <div
      className="group bg-card rounded-lg overflow-hidden border border-border hover:border-neon transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      data-ocid={`shop.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => navigate(`/product/${String(sneaker.id)}`)}
        aria-label={`View ${sneaker.name}`}
      >
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={sneaker.imageUrl}
            alt={sneaker.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            className="min-w-0 text-left"
            onClick={() => navigate(`/product/${String(sneaker.id)}`)}
          >
            <Badge
              variant="secondary"
              className="text-xs mb-1 tracking-widest uppercase text-muted-foreground"
            >
              {sneaker.brand}
            </Badge>
            <h3 className="font-display font-semibold text-sm leading-tight truncate">
              {sneaker.name}
            </h3>
            <p className="text-neon font-bold text-lg mt-1">
              ${(Number(sneaker.price) / 100).toFixed(2)}
            </p>
          </button>
          <Button
            type="button"
            size="icon"
            className="flex-shrink-0 bg-neon text-background hover:bg-neon/80 rounded-full h-9 w-9"
            onClick={handleAddToCart}
            data-ocid={`shop.secondary_button.${index + 1}`}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {sneaker.sizes.slice(0, 4).map((s) => (
            <span
              key={s}
              className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
            >
              {s}
            </span>
          ))}
          {sneaker.sizes.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{sneaker.sizes.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
