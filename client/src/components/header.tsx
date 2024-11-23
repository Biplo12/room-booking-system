"use client";

import Link from "next/link";
import { BookCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { Button } from "./ui/button";
import { useSession } from "@/hooks/auth";
import Spinner from "./spinner";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  const { isLoading } = useSession();

  const isActive = (href: string) => pathname === href;

  const getNavItems = () => {
    const items = [{ label: "Rooms", href: "/" }];

    if (isAuthenticated) {
      items.push({ label: "My Bookings", href: "/user" });
      if (user?.role === "admin") {
        items.push({ label: "Admin", href: "/admin" });
      }
    }

    return items;
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = getNavItems();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookCheck className="h-6 w-6" />
            <h1 className="text-xl font-bold">Conference Room Booking</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm hover:text-primary text-muted-foreground",
                    isActive(item.href) && "text-primary cursor-default"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {isLoading ? (
              <Button disabled className="w-20">
                <Spinner />
              </Button>
            ) : isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
