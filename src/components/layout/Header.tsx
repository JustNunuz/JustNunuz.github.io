import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/about", label: "whoami" },
  { href: "/work", label: "Tools" },
  { href: "/threat-map", label: "Threats" },
  { href: "/blog", label: "Notes" },
  { href: "/contact", label: "Contact" },
];

const routePrefixes: Record<string, string> = {
  "/": "root",
  "/work": "work",
  "/blog": "blog",
  "/about": "whoami",
  "/contact": "contact",
  "/threat-map": "threats",
};

const routeHints: Record<string, string> = {
  "/": "// start here",
  "/about": "// about me",
  "/work": "// projects built",
  "/threat-map": "// threat map",
  "/blog": "// blog posts",
  "/contact": "// reach out",
};

export function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const prefix = routePrefixes[location.pathname] || "root";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="group flex items-center gap-2 font-mono text-sm font-medium text-primary hover:opacity-80 transition-opacity"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span>{`${prefix}@justnunuz`}</span>
          <span className="animate-blink text-primary">_</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group relative font-mono text-sm transition-colors hover:text-primary link-underline",
                "text-muted-foreground"
              )}
            >
              {item.label}
              <span className="pointer-events-none absolute -bottom-5 left-0 whitespace-nowrap text-[10px] text-primary/70 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                {routeHints[item.href]}
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background border-border">
            <div className="flex flex-col gap-6 mt-8">
              <div className="font-mono text-sm text-primary mb-4">
                {"// Navigation"}
              </div>
              {navItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "font-mono text-lg transition-colors hover:text-primary py-2",
                      "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-primary mr-2">→</span>
                    {item.label}
                    <span className="ml-2 text-[11px] text-muted-foreground/60">
                      {routeHints[item.href]}
                    </span>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
