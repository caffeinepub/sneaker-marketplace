import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Filter, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import SneakerCard from "../components/SneakerCard";
import { useActor } from "../hooks/useActor";

const ALL_BRANDS = [
  "Nike",
  "Adidas",
  "Jordan",
  "New Balance",
  "Puma",
  "Converse",
];
const ALL_CATEGORIES = [
  "Lifestyle",
  "Running",
  "Basketball",
  "Training",
  "Skateboarding",
];
const ALL_SIZES = ["6", "7", "8", "9", "10", "11", "12", "13"];

export default function ShopPage() {
  const { actor, isFetching } = useActor();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: sneakers, isLoading } = useQuery({
    queryKey: ["sneakers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSneakers();
    },
    enabled: !!actor && !isFetching,
  });

  const filtered = (sneakers ?? []).filter((s) => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(s.brand))
      return false;
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(s.category)
    )
      return false;
    if (selectedSize && !s.sizes.includes(selectedSize)) return false;
    return true;
  });

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-xs tracking-widest uppercase text-muted-foreground mb-3">
          BRAND
        </h3>
        <div className="space-y-2">
          {ALL_BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="border-border data-[state=checked]:bg-neon data-[state=checked]:border-neon"
                data-ocid="shop.checkbox"
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-xs tracking-widest uppercase text-muted-foreground mb-3">
          CATEGORY
        </h3>
        <div className="space-y-2">
          {ALL_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
                className="border-border data-[state=checked]:bg-neon data-[state=checked]:border-neon"
                data-ocid="shop.checkbox"
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-xs tracking-widest uppercase text-muted-foreground mb-3">
          SIZE
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setSelectedSize(selectedSize === size ? null : size)
              }
              className={`w-10 h-10 rounded text-xs font-semibold border transition-all ${
                selectedSize === size
                  ? "bg-neon text-background border-neon"
                  : "bg-secondary border-border text-muted-foreground hover:border-neon hover:text-foreground"
              }`}
              data-ocid="shop.toggle"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {(selectedBrands.length > 0 ||
        selectedCategories.length > 0 ||
        selectedSize) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => {
            setSelectedBrands([]);
            setSelectedCategories([]);
            setSelectedSize(null);
          }}
          data-ocid="shop.secondary_button"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-4xl tracking-tight">
          ALL SNEAKERS
        </h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} sneaker{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Mobile filter toggle */}
      <Button
        type="button"
        variant="outline"
        className="lg:hidden mb-4 border-border"
        onClick={() => setFiltersOpen(!filtersOpen)}
        data-ocid="shop.toggle"
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
        {(selectedBrands.length > 0 ||
          selectedCategories.length > 0 ||
          selectedSize) && (
          <span className="ml-2 bg-neon text-background text-xs font-bold rounded-full px-1.5">
            !
          </span>
        )}
      </Button>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <aside
          className={`${
            filtersOpen ? "block" : "hidden"
          } lg:block w-full lg:w-56 flex-shrink-0`}
          data-ocid="shop.panel"
        >
          <div className="sticky top-24">
            <h2 className="font-display font-bold text-xs tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
              <Filter className="h-3.5 w-3.5" /> FILTERS
            </h2>
            <FilterPanel />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                "sk-1",
                "sk-2",
                "sk-3",
                "sk-4",
                "sk-5",
                "sk-6",
                "sk-7",
                "sk-8",
              ].map((key) => (
                <Skeleton
                  key={key}
                  className="aspect-[4/5] rounded-lg bg-card"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="shop.empty_state"
            >
              <p className="text-lg tracking-wider">
                No sneakers match your filters.
              </p>
              <Button
                type="button"
                variant="ghost"
                className="mt-4 text-neon"
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedCategories([]);
                  setSelectedSize(null);
                }}
                data-ocid="shop.secondary_button"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((sneaker, i) => (
                <motion.div
                  key={String(sneaker.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  <SneakerCard sneaker={sneaker} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
