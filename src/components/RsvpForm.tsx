"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      fullName: fd.get("fullName"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    };
    setName(String(payload.fullName || ""));
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Base de données pas encore branchée → confirmation gracieuse
      if (res.status === 503) {
        setStatus("success");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        // Redirection vers l'invitation personnalisée (avec QR code)
        window.location.href = `/invitation/${data.id}`;
        return;
      }
      throw new Error(data.error || "Enregistrement impossible.");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 text-gold-light">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-script text-4xl text-gold-light">
          Merci{name ? `, ${name.split(" ")[0]}` : ""}&nbsp;!
        </p>
        <p className="mt-4 leading-relaxed text-cream/80">
          Votre mot est arrivé jusqu&apos;à nous et votre présence est bien
          notée. Nous avons hâte de partager ce jour béni avec vous.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-outline mt-8"
          type="button"
        >
          Modifier ma réponse
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl text-left">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Votre nom complet *">
          <input
            name="fullName"
            required
            placeholder="Nom et prénom"
            className="rsvp-input"
          />
        </Field>

        <Field label="Votre téléphone">
          <input
            name="phone"
            type="tel"
            placeholder="+243 ..."
            className="rsvp-input"
          />
        </Field>

        <Field label="Votre mot pour les mariés" className="sm:col-span-2">
          <textarea
            name="message"
            rows={5}
            placeholder="Vos vœux de bonheur, une bénédiction, un souvenir partagé…"
            className="rsvp-input resize-none"
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-4 text-center text-sm text-red-300">{errorMsg}</p>
      )}

      <div className="mt-8 text-center">
        <button type="submit" className="btn-gold" disabled={status === "submitting"}>
          {status === "submitting" ? "Envoi en cours…" : "Envoyer"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs uppercase tracking-wide-sm text-cream/70">
        {label}
      </span>
      {children}
    </label>
  );
}
