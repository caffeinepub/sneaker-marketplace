import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../CartContext";
import { useActor } from "../hooks/useActor";
import { useRouter } from "../router";

export default function ProductDetailPage() {
  const { params, navigate } = useRouter();
  const { actor, isFetching } = useActor();
  const { addToCart, setIsOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wished, setWished] = useState(false);

  const sneakerId = BigInt(params.id ?? "0");

  const { data: sneaker, isLoading } = useQuery({
    queryKey: ["sneaker", String(sneakerId)],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSneaker(sneakerId);
    },
    enabled: !!actor && !isFetching && !!params.id,
  });

  const handleAddToCart = () => {
    if (!sneaker) return;
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      sneakerId: sneaker.id,
      name: sneaker.name,
      brand: sneaker.brand,
      price: sneaker.price,
      size: selectedSize,
      quantity: 1,
      imageUrl: sneaker.imageUrl,
    });
    toast.success(`${sneaker.name} added to cart`);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-xl bg-card" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 bg-card" />
            <Skeleton className="h-12 w-full bg-card" />
            <Skeleton className="h-8 w-32 bg-card" />
            <Skeleton className="h-24 w-full bg-card" />
          </div>
        </div>
      </div>
    );
  }

  if (!sneaker) {
    return (
      <div
        className="max-w-6xl mx-auto px-4 py-8 text-center"
        data-ocid="product.error_state"
      >
        <p className="text-muted-foreground">Sneaker not found.</p>
        <Button
          type="button"
          variant="ghost"
          className="mt-4 text-neon"
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate("/shop")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 p-0 h-auto"
        data-ocid="product.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-xl overflow-hidden bg-card border border-border"
        >
          <img
            src={sneaker.imageUrl}
            alt={sneaker.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-5"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant="secondary"
                className="tracking-widest uppercase text-muted-foreground"
              >
                {sneaker.brand}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                {sneaker.category}
              </Badge>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              {sneaker.name}
            </h1>
          </div>

          <div className="text-4xl font-display font-extrabold text-neon neon-text-glow">
            ${(Number(sneaker.price) / 100).toFixed(2)}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {sneaker.description}
          </p>

          {/* Size selection */}
          <div data-ocid="product.panel">
            <h3 className="font-display font-bold text-xs tracking-widest uppercase text-muted-foreground mb-3">
              SELECT SIZE
              {!selectedSize && (
                <span className="text-destructive ml-2 normal-case font-normal text-xs">
                  (required)
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sneaker.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] h-12 px-3 rounded-lg text-sm font-semibold border transition-all ${
                    selectedSize === size
                      ? "bg-neon text-background border-neon shadow-neon"
                      : "bg-secondary border-border text-muted-foreground hover:border-neon hover:text-foreground"
                  }`}
                  data-ocid="product.toggle"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              size="lg"
              className="flex-1 bg-neon text-background font-bold tracking-widest uppercase hover:bg-neon/90 hover:shadow-neon transition-all"
              onClick={handleAddToCart}
              data-ocid="product.primary_button"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              ADD TO CART
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className={`border-border ${
                wished
                  ? "text-red-400 border-red-400"
                  : "text-muted-foreground hover:text-red-400 hover:border-red-400"
              }`}
              onClick={() => setWished(!wished)}
              data-ocid="product.toggle"
            >
              <Heart className={`h-5 w-5 ${wished ? "fill-red-400" : ""}`} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
