import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order, Sneaker } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRouter } from "../router";

const SAMPLE_SNEAKERS = [
  {
    name: "Nike Air Max 90",
    brand: "Nike",
    category: "Lifestyle",
    price: 14999,
    description:
      "The iconic Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU details.",
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    name: "Nike Air Force 1",
    brand: "Nike",
    category: "Basketball",
    price: 10999,
    description:
      "The radiance lives on in the Nike Air Force 1, the b-ball icon that puts a fresh spin on what you know best: durably stitched overlays, clean finishes.",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
  },
  {
    name: "Adidas Ultraboost",
    brand: "Adidas",
    category: "Running",
    price: 18999,
    description:
      "Feel the energy return with every step. The Ultraboost features responsive Boost cushioning and a Primeknit+ upper.",
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    name: "Adidas Stan Smith",
    brand: "Adidas",
    category: "Lifestyle",
    price: 8999,
    description:
      "The Stan Smith tennis shoe has become a timeless style icon. Clean lines and minimalist design make it a wardrobe staple.",
    sizes: ["6", "7", "8", "9", "10", "11"],
  },
  {
    name: "Jordan 1 Retro High",
    brand: "Jordan",
    category: "Basketball",
    price: 17999,
    description:
      "The Air Jordan 1 Retro High OG is a remastered version of the original 1985 design. Bold colors and premium leather upper.",
    sizes: ["8", "9", "10", "11", "12"],
  },
  {
    name: "Jordan 4 Retro",
    brand: "Jordan",
    category: "Basketball",
    price: 29999,
    description:
      "The Air Jordan 4 Retro brings back the iconic 1989 design with its mesh panels, lace wings, and visible Air unit in the heel.",
    sizes: ["8", "9", "10", "11"],
  },
  {
    name: "New Balance 990",
    brand: "New Balance",
    category: "Lifestyle",
    price: 18499,
    description:
      "Made in USA. The 990 features premium pigskin and mesh upper with ENCAP midsole technology for superior cushioning and support.",
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    name: "New Balance 574",
    brand: "New Balance",
    category: "Lifestyle",
    price: 9999,
    description:
      "The 574 is a versatile lifestyle sneaker with EVA foam midsole for all-day comfort. A true New Balance classic.",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
  },
];

type SneakerForm = {
  name: string;
  brand: string;
  category: string;
  price: string;
  description: string;
  sizes: string;
  imageUrl: string;
  isActive: boolean;
};

const defaultForm: SneakerForm = {
  name: "",
  brand: "",
  category: "",
  price: "",
  description: "",
  sizes: "7, 8, 9, 10, 11",
  imageUrl: "",
  isActive: true,
};

export default function AdminPage() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const { navigate } = useRouter();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSneaker, setEditingSneaker] = useState<Sneaker | null>(null);
  const [form, setForm] = useState<SneakerForm>(defaultForm);
  const [seeding, setSeeding] = useState(false);

  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: sneakers, isLoading: sneakersLoading } = useQuery({
    queryKey: ["sneakers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSneakers();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (s: Sneaker) => actor!.createSneaker(s),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sneakers"] });
      toast.success("Sneaker created!");
      setDialogOpen(false);
      setForm(defaultForm);
    },
    onError: () => toast.error("Failed to create sneaker"),
  });

  const updateMutation = useMutation({
    mutationFn: async (s: Sneaker) => actor!.updateSneaker(s),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sneakers"] });
      toast.success("Sneaker updated!");
      setDialogOpen(false);
      setEditingSneaker(null);
      setForm(defaultForm);
    },
    onError: () => toast.error("Failed to update sneaker"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => actor!.deleteSneaker(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sneakers"] });
      toast.success("Sneaker deleted");
    },
    onError: () => toast.error("Failed to delete sneaker"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) =>
      actor!.updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allOrders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order status"),
  });

  const handleSubmit = () => {
    const sizes = form.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const priceNum = Math.round(Number.parseFloat(form.price) * 100);
    if (
      Number.isNaN(priceNum) ||
      !form.name ||
      !form.brand ||
      sizes.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    const imageUrl =
      form.imageUrl ||
      `https://placehold.co/400x300/2A2F31/B6F43A?text=${encodeURIComponent(form.name)}`;

    const sneaker: Sneaker = {
      id: editingSneaker ? editingSneaker.id : BigInt(0),
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: BigInt(priceNum),
      description: form.description,
      sizes,
      imageUrl,
      isActive: form.isActive,
    };

    if (editingSneaker) {
      updateMutation.mutate(sneaker);
    } else {
      createMutation.mutate(sneaker);
    }
  };

  const handleEdit = (sneaker: Sneaker) => {
    setEditingSneaker(sneaker);
    setForm({
      name: sneaker.name,
      brand: sneaker.brand,
      category: sneaker.category,
      price: (Number(sneaker.price) / 100).toFixed(2),
      description: sneaker.description,
      sizes: sneaker.sizes.join(", "),
      imageUrl: sneaker.imageUrl,
      isActive: sneaker.isActive,
    });
    setDialogOpen(true);
  };

  const handleSeedData = async () => {
    if (!actor) return;
    setSeeding(true);
    try {
      await Promise.all(
        SAMPLE_SNEAKERS.map((s) =>
          actor.createSneaker({
            id: BigInt(0),
            name: s.name,
            brand: s.brand,
            category: s.category,
            price: BigInt(s.price),
            description: s.description,
            sizes: s.sizes,
            imageUrl: `https://placehold.co/400x300/2A2F31/B6F43A?text=${encodeURIComponent(s.name)}`,
            isActive: true,
          }),
        ),
      );
      qc.invalidateQueries({ queryKey: ["sneakers"] });
      toast.success("Sample data seeded successfully!");
    } catch {
      toast.error("Failed to seed data");
    } finally {
      setSeeding(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-bold text-xl tracking-wider mb-2">
          ADMIN ACCESS REQUIRED
        </h2>
        <p className="text-muted-foreground mb-6">
          Please log in to access the admin panel.
        </p>
        <Button
          type="button"
          className="bg-neon text-background font-bold tracking-widest"
          onClick={login}
          data-ocid="admin.primary_button"
        >
          LOGIN
        </Button>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-20 text-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-neon mx-auto" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <h2 className="font-display font-bold text-xl tracking-wider mb-2">
          ACCESS DENIED
        </h2>
        <p className="text-muted-foreground mb-6">
          You do not have admin privileges.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
          data-ocid="admin.primary_button"
        >
          GO HOME
        </Button>
      </div>
    );
  }

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight mb-8">
        ADMIN PANEL
      </h1>

      <Tabs defaultValue="sneakers" data-ocid="admin.panel">
        <TabsList className="bg-card border border-border mb-6">
          <TabsTrigger
            value="sneakers"
            className="data-[state=active]:bg-neon data-[state=active]:text-background"
            data-ocid="admin.tab"
          >
            <Package className="h-4 w-4 mr-2" />
            SNEAKERS
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-neon data-[state=active]:text-background"
            data-ocid="admin.tab"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            ORDERS
          </TabsTrigger>
        </TabsList>

        {/* Sneakers Tab */}
        <TabsContent value="sneakers">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground text-sm">
              {sneakers?.length ?? 0} sneakers total
            </p>
            <div className="flex gap-2">
              {sneakers?.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-neon/50 text-neon hover:bg-neon/10"
                  onClick={handleSeedData}
                  disabled={seeding}
                  data-ocid="admin.secondary_button"
                >
                  {seeding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Seed Sample Data
                </Button>
              )}
              <Button
                type="button"
                className="bg-neon text-background font-bold tracking-widest hover:bg-neon/90"
                onClick={() => {
                  setEditingSneaker(null);
                  setForm(defaultForm);
                  setDialogOpen(true);
                }}
                data-ocid="admin.open_modal_button"
              >
                <Plus className="mr-2 h-4 w-4" /> ADD SNEAKER
              </Button>
            </div>
          </div>

          {sneakersLoading ? (
            <div className="space-y-2" data-ocid="admin.loading_state">
              {["sk-a", "sk-b", "sk-c", "sk-d", "sk-e"].map((key) => (
                <Skeleton key={key} className="h-14 rounded-lg bg-card" />
              ))}
            </div>
          ) : sneakers?.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No sneakers yet. Click "Seed Sample Data" to get started.</p>
            </div>
          ) : (
            <div
              className="border border-border rounded-xl overflow-hidden"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Image
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Brand
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sneakers?.map((sneaker, i) => (
                    <TableRow
                      key={String(sneaker.id)}
                      className="border-border"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell>
                        <img
                          src={sneaker.imageUrl}
                          alt={sneaker.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-semibold">
                        {sneaker.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sneaker.brand}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sneaker.category}
                      </TableCell>
                      <TableCell className="text-neon font-bold">
                        ${(Number(sneaker.price) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border ${
                            sneaker.isActive
                              ? "bg-neon/10 text-neon border-neon/30"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {sneaker.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-neon"
                            onClick={() => handleEdit(sneaker)}
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(sneaker.id)}
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          {ordersLoading ? (
            <div className="space-y-2" data-ocid="admin.loading_state">
              {["sk-a", "sk-b", "sk-c", "sk-d", "sk-e"].map((key) => (
                <Skeleton key={key} className="h-14 rounded-lg bg-card" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No orders yet.</p>
            </div>
          ) : (
            <div
              className="border border-border rounded-xl overflow-hidden"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Order ID
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Items
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Total
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order, i: number) => (
                    <TableRow
                      key={String(order.id)}
                      className="border-border"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="font-bold">
                        #{String(order.id)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="text-neon font-bold">
                        ${(Number(order.totalPrice) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(
                          Number(order.timestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(val) =>
                            updateStatusMutation.mutate({
                              id: order.id,
                              status: val,
                            })
                          }
                        >
                          <SelectTrigger
                            className="w-36 h-8 text-xs border-border bg-secondary"
                            data-ocid={`admin.select.${i + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {[
                              "pending",
                              "processing",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ].map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingSneaker(null);
            setForm(defaultForm);
          }
        }}
      >
        <DialogContent
          className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">
              {editingSneaker ? "EDIT SNEAKER" : "ADD SNEAKER"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                  Name *
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Air Max 90"
                  className="bg-secondary border-border"
                  data-ocid="admin.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                  Brand *
                </Label>
                <Input
                  value={form.brand}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, brand: e.target.value }))
                  }
                  placeholder="Nike"
                  className="bg-secondary border-border"
                  data-ocid="admin.input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                  Category
                </Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="Lifestyle"
                  className="bg-secondary border-border"
                  data-ocid="admin.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                  Price (USD) *
                </Label>
                <Input
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="149.99"
                  type="number"
                  step="0.01"
                  className="bg-secondary border-border"
                  data-ocid="admin.input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the sneaker..."
                className="bg-secondary border-border resize-none"
                rows={3}
                data-ocid="admin.textarea"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                Sizes * (comma-separated)
              </Label>
              <Input
                value={form.sizes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sizes: e.target.value }))
                }
                placeholder="7, 8, 9, 10, 11, 12"
                className="bg-secondary border-border"
                data-ocid="admin.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                Image URL (optional)
              </Label>
              <Input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                className="bg-secondary border-border"
                data-ocid="admin.input"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-border"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-neon text-background font-bold tracking-widest hover:bg-neon/90"
              onClick={handleSubmit}
              disabled={isMutating}
              data-ocid="admin.submit_button"
            >
              {isMutating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingSneaker ? "UPDATE" : "CREATE"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
