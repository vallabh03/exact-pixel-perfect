import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PAANI CLOTHING" },
      {
        name: "description",
        content:
          "Contact PAANI CLOTHING for custom-design enquiries — email, Instagram, and WhatsApp.",
      },
      { property: "og:title", content: "Contact — PAANI CLOTHING" },
      {
        property: "og:description",
        content:
          "Contact PAANI CLOTHING for custom-design enquiries — email, Instagram, and WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: SITE.mailto,
    note: "For custom-design enquiries and appointments.",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: SITE.instagramHandle,
    href: SITE.instagram,
    note: "Follow the latest looks from the atelier.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "On request",
    href: null,
    note: SITE.whatsappNote,
  },
  {
    icon: MapPin,
    label: "Studio",
    value: SITE.location,
    href: null,
    note: "Where every piece is designed and crafted.",
  },
];

function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <p className="eyebrow text-muted-foreground">Get in touch</p>
      <h1 className="mt-2 font-display text-5xl font-medium text-foreground sm:text-6xl">
        Contact
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        For custom-design enquiries, collection details, and appointments, we
        would love to hear from you.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const body = (
            <>
              <Icon className="h-5 w-5 text-foreground" />
              <div>
                <p className="eyebrow text-muted-foreground">{channel.label}</p>
                <p className="mt-1 font-display text-xl text-foreground">
                  {channel.value}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {channel.note}
                </p>
              </div>
            </>
          );
          return channel.href ? (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="flex gap-4 border border-border bg-card p-6 transition-colors hover:bg-accent"
            >
              {body}
            </a>
          ) : (
            <div
              key={channel.label}
              className="flex gap-4 border border-border bg-card p-6"
            >
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
