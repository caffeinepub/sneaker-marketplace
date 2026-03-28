import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Link, useRouter } from "../router";

export default function Navbar() {
  const { cartCount, setIsOpen } = useCart();
  const { navigate } = useRouter();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;

  const navLinks = [
    { label: "SHOP", to: "/shop" },
    { label: "NEW ARRIVALS", to: "/shop" },
    { label: "BRANDS", to: "/shop" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.link"
          className="font-display font-extrabold text-2xl tracking-widest text-neon neon-text-glow"
        >
          KICKVAULT
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                data-ocid="nav.link"
                className="text-muted-foreground hover:text-foreground text-sm font-semibold tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/shop")}
            data-ocid="nav.link"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* User */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-neon"
                  data-ocid="nav.link"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-card border-border"
              >
                <DropdownMenuItem
                  onClick={() => navigate("/orders")}
                  data-ocid="nav.link"
                >
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/admin")}
                  data-ocid="nav.link"
                >
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clear}
                  className="text-destructive"
                  data-ocid="nav.link"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-neon"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.link"
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-neon"
            onClick={() => setIsOpen(true)}
            data-ocid="nav.open_modal_button"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-neon text-background text-xs font-bold">
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              data-ocid="nav.link"
              className="block py-3 text-muted-foreground hover:text-foreground text-sm font-semibold tracking-wider border-b border-border last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
