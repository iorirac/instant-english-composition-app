/// <reference types="google.accounts" />
import { useEffect, useRef } from "react";

type Props = {
  onToken: (token: string) => void;
  buttonOptions?: google.accounts.id.GsiButtonConfiguration;
  className?: string;
};

function ensureGsiScript(): Promise<void> {
  if (
    typeof window !== "undefined" &&
    typeof google !== "undefined" &&
    google.accounts?.id
  )
    return Promise.resolve();
  const id = "google-identity-services";
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Identity script"))
      );
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () =>
      reject(new Error("Failed to load Google Identity script"));
    document.head.appendChild(s);
  });
}

export function GoogleLoginButton({ onToken }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const parentEl = containerRef.current;
    const init = () => {
      if (cancelled) return;
      const g = google?.accounts?.id;
      if (!g) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
        | string
        | undefined;
      if (!clientId) {
        return;
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: google.accounts.id.CredentialResponse) => {
          if (resp && typeof resp.credential === "string")
            onToken(resp.credential);
        },
      });

      if (parentEl) {
        parentEl.innerHTML = "";
        const cfg = {
          theme: "outline",
          size: "large",
        } as unknown as google.accounts.id.GsiButtonConfiguration;
        google.accounts.id.renderButton(parentEl, cfg);
      }
      google.accounts.id.prompt?.();
    };

    ensureGsiScript()
      .then(init)
      .catch(() => {});

    return () => {
      cancelled = true;
      if (parentEl) parentEl.innerHTML = "";
    };
  }, [onToken]);

  return <div ref={containerRef} />;
}
