import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthSession } from "@/lib/auth-state";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — PAANI CLOTHING" },
      {
        name: "description",
        content: "Sign in to the PAANI CLOTHING collection studio.",
      },
      { property: "og:title", content: "Sign in — PAANI CLOTHING" },
      {
        property: "og:description",
        content: "Sign in to the PAANI CLOTHING collection studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, ready } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [busy, setBusy] = useState(false);

  // Already signed in: head to the studio.
  useEffect(() => {
    if (ready && user) navigate({ to: "/studio" });
  }, [ready, user]);

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate({ to: "/studio" });
  }

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    // With email confirmation enabled, there is no session until the
    // confirmation link is clicked.
    if (!data.session) setConfirmationSent(true);
    else navigate({ to: "/studio" });
  }

  if (confirmationSent) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-foreground">
          Check your email
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then sign in here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20 sm:py-28">
      <p className="eyebrow text-center text-muted-foreground">PAANI CLOTHING</p>
      <h1 className="mt-2 text-center font-display text-4xl font-medium text-foreground">
        Collection Studio
      </h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Sign in to publish and manage collections.
      </p>

      <Tabs defaultValue="signin" className="mt-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
