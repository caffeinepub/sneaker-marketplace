import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Package } from "lucide-react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRouter } from "../router";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  delivered: "bg-neon/10 text-neon border-neon/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

const SKELETON_KEYS = ["skel-a", "skel-b", "skel-c"];

export default function OrdersPage() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const { navigate } = useRouter();

  const isAuthenticated = !!identity;

  // ArrowRight used in possible future link - suppressed via usage below
  void ArrowRight;

  const { data: orders, isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h2 className="font-display font-bold text-xl tracking-wider mb-2">
          LOGIN REQUIRED
        </h2>
        <p className="text-muted-foreground mb-6">
          Please log in to view your orders.
        </p>
        <Button
          type="button"
          className="bg-neon text-background font-bold tracking-widest"
          onClick={login}
          data-ocid="orders.primary_button"
        >
          LOGIN
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight mb-8">
        MY ORDERS
      </h1>

      {isLoading ? (
        <div className="space-y-4" data-ocid="orders.loading_state">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-28 rounded-xl bg-card" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-20" data-ocid="orders.empty_state">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground tracking-wider mb-4">
            No orders yet.
          </p>
          <Button
            type="button"
            className="bg-neon text-background font-bold tracking-widest"
            onClick={() => navigate("/shop")}
            data-ocid="orders.primary_button"
          >
            START SHOPPING
          </Button>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="orders.list">
          {orders.map((order, i) => (
            <div
              key={String(order.id)}
              className="bg-card border border-border rounded-xl p-5 hover:border-neon/40 transition-colors"
              data-ocid={`orders.item.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-display font-bold tracking-wider">
                    ORDER #{String(order.id)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(
                      Number(order.timestamp) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`text-xs uppercase tracking-widest border ${
                      statusColor[order.status] ??
                      "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {order.status}
                  </Badge>
                  <p className="font-bold text-neon">
                    ${(Number(order.totalPrice) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
