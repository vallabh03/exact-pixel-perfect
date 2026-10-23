import { Link } from "@tanstack/react-router";

export function LoadError({ error }: { error: unknown }) {
  return (
    <div className="mx-auto max-w-md px-6 py-32 text-center">
      <p className="font-display text-3xl text-foreground">
        This page didn't load
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "Something went wrong on our end."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 inline-flex items-center justify-center border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        Try again
      </button>
    </div>
  );
}

export function MissingPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-32 text-center">
      <p className="font-display text-3xl text-foreground">
        Nothing to see here
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        This page may have been moved or is not yet published.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        Back home
      </Link>
    </div>
  );
}
