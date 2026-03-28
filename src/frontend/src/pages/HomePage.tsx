import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "motion/react";
import SneakerCard from "../components/SneakerCard";
import { useActor } from "../hooks/useActor";
import { Link, useRouter } from "../router";

const brands = [
  { name: "Nike", color: "hover:border-orange-500" },
  { name: "Adidas", color: "hover:border-blue-500" },
  { name: "New Balance", color: "hover:border-gray-400" },
  { name: "Jordan", color: "hover:border-red-500" },
  { name: "Puma", color: "hover:border-yellow-500" },
  { name: "Converse", color: "hover:border-purple-500" },
];

export default function HomePage() {
  const { actor, isFetching } = useActor();
  const { navigate } = useRouter();

  const { data: sneakers, isLoading } = useQuery({
    queryKey: ["sneakers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSneakers();
    },
    enabled: !!actor && !isFetching,
  });

  const hotDrops = sneakers?.slice(0, 4) ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.17 0 0) 0%, oklch(0.20 0.01 200) 50%, oklch(0.17 0 0) 100%)",
        }}
        data-ocid="home.section"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.92 0.22 120) 1px, transparent 1px), linear-gradient(90deg, oklch(0.92 0.22 120) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.92 0.22 120) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/30 rounded-full px-4 py-1.5 mb-6">
            <Zap className="h-3.5 w-3.5 text-neon" />
            <span className="text-neon text-xs font-semibold tracking-widest uppercase">
              New Drops Every Week
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl leading-none tracking-tight mb-6">
            FIND YOUR
            <br />
            <span className="text-neon neon-text-glow">PERFECT</span>
            <br />
            KICK
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
            Exclusive sneakers, rare drops, and iconic styles — all in one
            vault.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              size="lg"
              className="bg-neon text-background font-bold tracking-widest text-base uppercase px-8 hover:bg-neon/90 hover:shadow-neon transition-all"
              onClick={() => navigate("/shop")}
              data-ocid="home.primary_button"
            >
              SHOP NOW
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:border-neon hover:text-neon tracking-widest uppercase"
              onClick={() => navigate("/shop")}
              data-ocid="home.secondary_button"
            >
              VIEW ALL DROPS
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Hot Drops */}
      <section
        className="py-16 px-4 max-w-7xl mx-auto w-full"
        data-ocid="home.section"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-neon text-xs font-semibold tracking-widest uppercase mb-1">
              🔥 Featured
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              HOT DROPS
            </h2>
          </div>
          <Link
            to="/shop"
            data-ocid="home.link"
            className="text-neon text-sm font-semibold tracking-wider hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {["sk-1", "sk-2", "sk-3", "sk-4"].map((key) => (
              <Skeleton key={key} className="aspect-[4/5] rounded-lg bg-card" />
            ))}
          </div>
        ) : hotDrops.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {hotDrops.map((sneaker, i) => (
              <motion.div
                key={String(sneaker.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <SneakerCard sneaker={sneaker} index={i} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="home.empty_state"
          >
            <p className="tracking-wider">
              No sneakers yet. Visit the Admin Panel to seed data.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 border-neon text-neon"
              onClick={() => navigate("/admin")}
              data-ocid="home.primary_button"
            >
              GO TO ADMIN
            </Button>
          </div>
        )}
      </section>

      {/* Top Brands */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.20 0.005 210)" }}
        data-ocid="home.section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-neon text-xs font-semibold tracking-widest uppercase mb-2">
              We carry
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              TOP BRANDS
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {brands.map((brand) => (
              <button
                key={brand.name}
                type="button"
                className={`px-6 py-3 rounded-full border border-border bg-card font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105 ${brand.color} hover:text-foreground`}
                onClick={() => navigate("/shop")}
                data-ocid="home.button"
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-border py-8 px-4"
        data-ocid="home.section"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-display font-bold text-neon tracking-widest">
            KICKVAULT
          </span>
          <p>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neon"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
