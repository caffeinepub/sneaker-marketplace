import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./CartContext";
import CartDrawer from "./components/CartDrawer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ShopPage from "./pages/ShopPage";
import { RouterProvider, useRouter } from "./router";

function AppRoutes() {
  const { path } = useRouter();

  const renderPage = () => {
    if (path === "/") return <HomePage />;
    if (path === "/shop") return <ShopPage />;
    if (path.startsWith("/product/")) return <ProductDetailPage />;
    if (path === "/checkout") return <CheckoutPage />;
    if (path === "/admin") return <AdminPage />;
    if (path === "/orders") return <OrdersPage />;
    return <HomePage />;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 pt-16">{renderPage()}</main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </RouterProvider>
  );
}
