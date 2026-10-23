import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Menu, X } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/lib/auth-state";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/new-drops", label: "New Drops" },
  { to: "/our-story", label: "Our Story" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname.startsWith(to);
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, ready } = useAuthSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    setOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const linkClass = (to: string) =>
    `eyebrow transition-colors hover:text-foreground ${
      isActive(pathname, to)
        ? "text-foreground underline decoration-champagne underline-offset-8"
        : "text-muted-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex flex-col leading-none"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl font-semibold tracking-[0.18em] text-foreground">
            PAANI
          </span>
          <span className="eyebrow mt-1 text-muted-foreground">Clothing</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(link.to)}>
              {link.label}
            </Link>
          ))}
          {ready && user && (
            <>
              <Link to="/studio" className={linkClass("/studio")}>
                Studio
              </Link>
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </nav>

        <button
          className="p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-border/70 bg-background px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={linkClass(link.to)}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {ready && user && (
              <>
                <Link
                  to="/studio"
                  className={linkClass("/studio")}
                  onClick={() => setOpen(false)}
                >
                  Studio
                </Link>
                <button
                  onClick={handleSignOut}
                  className="eyebrow text-left text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
