"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";
import Papa from "papaparse";
import { wedding } from "@/lib/wedding";
import type { Guest } from "@/lib/supabaseAdmin";
import { KenteBand } from "@/components/Motifs";

type View = "loading" | "login" | "unconfigured" | "ready";
type Tab = "guests" | "scanner" | "photos";
type PhotoData = {
  couple: { david: string | null; manuella: string | null; hero: string | null };
  gallery: string[];
};
type CsvRow = { full_name: string; phone: string | null; party_size: number };

const NAME_KEYS = ["nom", "name", "fullname", "full_name", "invite", "invitee", "nomcomplet"];
const PHONE_KEYS = ["telephone", "phone", "tel", "numero", "whatsapp"];
const SIZE_KEYS = ["personnes", "partysize", "party_size", "places", "nombre", "nb", "accompagnants"];

function normKey(k: string): string {
  return k.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9_]/gi, "").toLowerCase();
}

function mapCsvRows(rows: Record<string, string>[]): CsvRow[] {
  const out: CsvRow[] = [];
  for (const row of rows) {
    let name = "", phone = "", size = 1;
    for (const [k, v] of Object.entries(row)) {
      const nk = normKey(k);
      const val = String(v ?? "").trim();
      if (!val) continue;
      if (NAME_KEYS.includes(nk)) name = val;
      else if (PHONE_KEYS.includes(nk)) phone = val;
      else if (SIZE_KEYS.includes(nk)) size = Math.min(20, Math.max(1, parseInt(val, 10) || 1));
    }
    if (!name) {
      const first = String(Object.values(row)[0] ?? "").trim();
      if (first) name = first;
    }
    if (name) out.push({ full_name: name, phone: phone || null, party_size: size });
  }
  return out;
}

export default function AdminPage() {
  const [view, setView] = useState<View>("loading");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("guests");
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [sortField, setSortField] = useState<"full_name" | "table_number" | "party_size" | "checked_in" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [password, setPassword] = useState("");

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSize, setNewSize] = useState(1);
  const [newTable, setNewTable] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const [csvRows, setCsvRows] = useState<CsvRow[] | null>(null);
  const [csvName, setCsvName] = useState("");

  const refreshPhotos = useCallback(async () => {
    const res = await fetch("/api/admin/photos");
    if (res.ok) setPhotoData(await res.json());
  }, []);

  useEffect(() => {
    if (activeTab === "photos" && !photoData) refreshPhotos();
  }, [activeTab, photoData, refreshPhotos]);

  const filteredGuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = q
      ? guests.filter(
          g =>
            g.full_name.toLowerCase().includes(q) ||
            (g.phone && g.phone.includes(q)) ||
            (g.table_number != null && String(g.table_number).includes(q))
        )
      : [...guests];

    if (sortField) {
      list.sort((a, b) => {
        const raw_a = a[sortField];
        const raw_b = b[sortField];
        const va: string | number | boolean = raw_a ?? (sortField === "full_name" ? "" : -Infinity);
        const vb: string | number | boolean = raw_b ?? (sortField === "full_name" ? "" : -Infinity);
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [guests, searchQuery, sortField, sortDir]);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  function exportCsv() {
    const rows = guests.map(g => ({
      Nom: g.full_name,
      Telephone: g.phone ?? "",
      Personnes: g.party_size,
      Table: g.table_number ?? "",
      Arrive: g.checked_in ? "Oui" : "Non",
      "Heure arrivee": g.checked_in_at
        ? new Date(g.checked_in_at).toLocaleString("fr-FR")
        : "",
      Message: g.message ?? "",
      Inscription: new Date(g.created_at).toLocaleDateString("fr-FR"),
    }));
    const csv = Papa.unparse(rows, { delimiter: ";" });
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invites-david-manuella-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const refresh = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/guests");
    if (res.status === 401) return setView("login");
    if (res.status === 503) return setView("unconfigured");
    if (!res.ok) { setView("ready"); return setError("Impossible de charger la liste des invités."); }
    const data = await res.json();
    setGuests(data.guests ?? []);
    setView("ready");
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); return setError(d.error || "Connexion impossible."); }
    setPassword(""); refresh();
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setView("login");
  }

  async function addGuests(list: (CsvRow & { table_number?: number | null })[], successMsg: string) {
    setBusy(true); setError(""); setNotice("");
    const res = await fetch("/api/admin/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guests: list }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "Enregistrement impossible.");
    setNotice(successMsg.replace("%n", String(data.inserted ?? list.length)));
    refresh();
  }

  async function handlePatch(id: string, patch: Record<string, unknown>): Promise<Guest | null> {
    setError("");
    const res = await fetch(`/api/admin/guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) { setError("Mise à jour impossible."); return null; }
    const data = await res.json();
    const updated = data.guest as Guest;
    setGuests(prev => prev.map(g => g.id === id ? updated : g));
    return updated;
  }

  async function handleCheckin(id: string): Promise<Guest | null> {
    return handlePatch(id, { checked_in: true });
  }

  async function handleToggleCheckin(g: Guest) {
    await handlePatch(g.id, { checked_in: !g.checked_in });
  }

  async function handleAddManual(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const tableNum = newTable.trim() ? parseInt(newTable, 10) || null : null;
    await addGuests(
      [{ full_name: newName.trim(), phone: newPhone.trim() || null, party_size: newSize, table_number: tableNum }],
      "Invité ajouté ✓"
    );
    setNewName(""); setNewPhone(""); setNewSize(1); setNewTable("");
  }

  function handleCsvFile(file: File) {
    setCsvName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = mapCsvRows(result.data);
        if (rows.length === 0) {
          setCsvRows(null);
          setError("Aucun invité reconnu dans ce CSV. Colonnes attendues : nom (obligatoire), telephone, personnes.");
          return;
        }
        setError(""); setCsvRows(rows);
      },
      error: () => setError("Lecture du fichier CSV impossible."),
    });
  }

  async function handleImport() {
    if (!csvRows) return;
    await addGuests(csvRows, "%n invités importés ✓");
    setCsvRows(null); setCsvName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(g: Guest) {
    if (!confirm(`Supprimer « ${g.full_name} » et son invitation ?`)) return;
    const res = await fetch(`/api/admin/guests/${g.id}`, { method: "DELETE" });
    if (!res.ok) return setError("Suppression impossible.");
    setGuests(prev => prev.filter(x => x.id !== g.id));
  }

  const stats = useMemo(() => {
    const persons = guests.reduce((s, g) => s + (g.party_size || 1), 0);
    const checked = guests.filter(g => g.checked_in).length;
    const tables = new Set(guests.filter(g => g.table_number != null).map(g => g.table_number)).size;
    return { invites: guests.length, persons, checked, tables };
  }, [guests]);

  /* ─── Vues de chargement / login / non configuré ─── */

  if (view === "loading") return <Shell><p className="text-center text-ink/50">Chargement…</p></Shell>;

  if (view === "login") {
    return (
      <Shell>
        <div className="mx-auto max-w-sm text-center">
          <h1 className="font-display text-4xl text-ink">Espace admin</h1>
          <p className="mt-3 text-sm text-ink/55">
            Gestion des invités du mariage de {wedding.groom.firstName} &amp; {wedding.bride.firstName}.
          </p>
          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe" className="admin-input" autoFocus />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-gold" disabled={busy}>
              {busy ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </Shell>
    );
  }

  if (view === "unconfigured") {
    return (
      <Shell>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-display text-4xl text-ink">Espace admin</h1>
          <p className="mt-6 rounded-xl border border-orange/30 bg-orange/8 p-6 text-sm leading-relaxed text-ink/75">
            La base de données n&apos;est pas encore configurée.
            <br />
            Ajoute les variables <code className="text-orange">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            et <code className="text-orange">SUPABASE_SERVICE_ROLE_KEY</code>, puis recharge cette page.
          </p>
        </div>
      </Shell>
    );
  }

  /* ─── Vue principale ─── */

  return (
    <Shell wide>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            Invités — {wedding.groom.firstName} &amp; {wedding.bride.firstName}
          </h1>
          <p className="mt-1 text-sm text-ink/50">{wedding.dateLabel} · {wedding.venue}, {wedding.city}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="btn-outline-dark !px-5 !py-2 text-[0.7rem]">↓ Export CSV</button>
          <button onClick={handleLogout} className="btn-outline-dark !px-5 !py-2 text-[0.7rem]">Se déconnecter</button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Invitations" value={stats.invites} />
        <Stat label="Personnes attendues" value={stats.persons} />
        <Stat label="Tables assignées" value={stats.tables} />
        <Stat label="Arrivés (scannés)" value={stats.checked} />
      </div>

      {(error || notice) && (
        <p className={`mt-6 rounded-lg border p-3 text-center text-sm ${error
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-orange/40 bg-orange/8 text-orange"}`}>
          {error || notice}
        </p>
      )}

      {/* Onglets */}
      <div className="mt-8 flex gap-2 border-b border-sand/50">
        {(["guests", "scanner", "photos"] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold uppercase tracking-wide-sm transition-colors ${
              activeTab === tab
                ? "border-b-2 border-orange text-orange"
                : "text-ink/40 hover:text-ink/65"
            }`}
          >
            {tab === "guests" ? "Invités" : tab === "scanner" ? "Scanner QR" : "Photos"}
          </button>
        ))}
      </div>

      {/* ── Onglet Invités ── */}
      {activeTab === "guests" && (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Import CSV */}
            <section className="rounded-2xl border border-sand/50 bg-cream/50 p-6">
              <h2 className="font-display text-2xl text-ink">Importer un CSV</h2>
              <p className="mt-2 text-xs leading-relaxed text-ink/50">
                Colonnes reconnues : <b className="text-ink/75">nom</b> (obligatoire),{" "}
                <b className="text-ink/75">telephone</b>, <b className="text-ink/75">personnes</b>.
              </p>
              <input ref={fileRef} type="file" accept=".csv,text/csv"
                className="mt-4 block w-full text-sm text-ink/65 file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-5 file:py-2.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide-sm file:text-ink hover:file:bg-gold-light"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleCsvFile(f); }} />
              {csvRows && (
                <div className="mt-4 rounded-xl border border-sand/40 bg-cream/70 p-4">
                  <p className="text-sm text-ink/75">
                    <b className="text-orange">{csvRows.length}</b> invités dans <i>{csvName}</i> :
                  </p>
                  <ul className="mt-2 max-h-36 overflow-y-auto text-xs text-ink/55">
                    {csvRows.slice(0, 8).map((r, i) => (
                      <li key={i}>• {r.full_name}{r.phone ? ` — ${r.phone}` : ""} ({r.party_size} pers.)</li>
                    ))}
                    {csvRows.length > 8 && <li>… et {csvRows.length - 8} autres</li>}
                  </ul>
                  <div className="mt-4 flex gap-3">
                    <button onClick={handleImport} className="btn-gold !px-6 !py-2.5 text-[0.7rem]" disabled={busy}>
                      {busy ? "Import…" : `Importer ${csvRows.length} invités`}
                    </button>
                    <button onClick={() => { setCsvRows(null); setCsvName(""); if (fileRef.current) fileRef.current.value = ""; }}
                      className="btn-outline-dark !px-6 !py-2.5 text-[0.7rem]">Annuler</button>
                  </div>
                </div>
              )}
            </section>

            {/* Ajout manuel */}
            <section className="rounded-2xl border border-sand/50 bg-cream/50 p-6">
              <h2 className="font-display text-2xl text-ink">Ajouter un invité</h2>
              <form onSubmit={handleAddManual} className="mt-4 flex flex-col gap-4">
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Nom complet *" required className="admin-input" />
                <div className="flex gap-3">
                  <input value={newPhone} onChange={e => setNewPhone(e.target.value)}
                    placeholder="Téléphone" className="admin-input flex-1" />
                  <select value={newSize} onChange={e => setNewSize(parseInt(e.target.value, 10))}
                    className="admin-input !w-28">
                    {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} pers.</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input value={newTable} onChange={e => setNewTable(e.target.value)}
                    placeholder="N° table (optionnel)" type="number" min="1" className="admin-input !w-48" />
                </div>
                <button type="submit" className="btn-gold self-start !px-6 !py-2.5 text-[0.7rem]" disabled={busy}>
                  Ajouter
                </button>
              </form>
            </section>
          </div>

          {/* Barre de recherche */}
          <div className="relative mt-6">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un invité, téléphone ou n° de table…"
              className="admin-input w-full pl-10"
            />
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-ink/35 hover:text-ink/60">×</button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-xs text-ink/40">
              {filteredGuests.length} résultat{filteredGuests.length !== 1 ? "s" : ""} sur {guests.length} invités
            </p>
          )}

          {/* Liste des invités */}
          <section className="mt-4 overflow-hidden rounded-2xl border border-sand/50 bg-cream/30">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-sand/40 text-xs uppercase tracking-wide-sm text-orange/70">
                    <SortTh field="full_name" current={sortField} dir={sortDir} onSort={toggleSort} className="px-5 py-4">Invité</SortTh>
                    <th className="px-3 py-4">Téléphone</th>
                    <SortTh field="party_size" current={sortField} dir={sortDir} onSort={toggleSort} className="px-3 py-4">Pers.</SortTh>
                    <SortTh field="table_number" current={sortField} dir={sortDir} onSort={toggleSort} className="px-3 py-4">Table</SortTh>
                    <SortTh field="checked_in" current={sortField} dir={sortDir} onSort={toggleSort} className="px-3 py-4">Arrivé</SortTh>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-ink/40">
                        Aucun invité — importe un CSV ou ajoute-les à la main.
                      </td>
                    </tr>
                  )}
                  {guests.length > 0 && filteredGuests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-ink/40">
                        Aucun résultat pour « {searchQuery} ».
                      </td>
                    </tr>
                  )}
                  {filteredGuests.map(g => (
                    <tr key={g.id} className="border-b border-sand/25 text-ink/75 hover:bg-orange/5">
                      <td className="px-5 py-3 font-medium text-ink">{g.full_name}</td>
                      <td className="px-3 py-3 text-ink/50">{g.phone || "—"}</td>
                      <td className="px-3 py-3">{g.party_size}</td>
                      <td className="px-3 py-3">
                        {g.table_number
                          ? <span className="rounded-full bg-orange/15 px-2.5 py-0.5 text-xs text-orange">Table {g.table_number}</span>
                          : <span className="text-ink/20">—</span>}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleToggleCheckin(g)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            g.checked_in
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "border border-ink/15 text-ink/30 hover:border-orange/50 hover:text-orange"
                          }`}
                        >
                          {g.checked_in ? "✓ Arrivé" : "Absent"}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <a href={`/invitation/${g.id}`} target="_blank" rel="noopener noreferrer"
                            className="rounded-full border border-sand/60 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:bg-orange hover:text-ivory">
                            Voir
                          </a>
                          <a href={`/api/invitation-image/${g.id}?download=1`}
                            className="rounded-full border border-sand/60 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:bg-orange hover:text-ivory">
                            PNG
                          </a>
                          <button
                            onClick={() => setEditingGuest(g)}
                            className="rounded-full border border-sand/60 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:bg-orange hover:text-ivory"
                            aria-label={`Modifier ${g.full_name}`}
                          >
                            ✎
                          </button>
                          <button onClick={() => handleDelete(g)}
                            className="rounded-full border border-red-300/60 px-3 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
                            aria-label={`Supprimer ${g.full_name}`}>
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ── Onglet Scanner ── */}
      {activeTab === "scanner" && (
        <div className="mt-8">
          <QrScanner onCheckin={handleCheckin} guests={guests} />
        </div>
      )}

      {/* ── Onglet Photos ── */}
      {activeTab === "photos" && (
        <PhotosTab
          data={photoData}
          busy={photoBusy}
          setBusy={setPhotoBusy}
          setError={setError}
          setNotice={setNotice}
          onRefresh={refreshPhotos}
        />
      )}

      {/* Modal d'édition */}
      {editingGuest && (
        <EditModal
          guest={editingGuest}
          onSave={async (patch) => {
            await handlePatch(editingGuest.id, patch);
            setEditingGuest(null);
            setNotice("Invité mis à jour ✓");
          }}
          onClose={() => setEditingGuest(null)}
        />
      )}
    </Shell>
  );
}

/* ─────────── Modal d'édition ─────────── */

function EditModal({
  guest,
  onSave,
  onClose,
}: {
  guest: Guest;
  onSave: (patch: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(guest.full_name);
  const [phone, setPhone] = useState(guest.phone ?? "");
  const [size, setSize] = useState(guest.party_size);
  const [table, setTable] = useState(String(guest.table_number ?? ""));
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      full_name: name.trim(),
      phone: phone.trim() || null,
      party_size: size,
      table_number: table.trim() ? parseInt(table, 10) || null : null,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-3xl border border-sand/50 bg-ivory p-8 shadow-2xl">
        <h2 className="font-display text-2xl text-ink">Modifier l&apos;invité</h2>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide-sm text-ink/50">Nom complet</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="admin-input w-full" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide-sm text-ink/50">Téléphone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="admin-input w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide-sm text-ink/50">Personnes</label>
              <select value={size} onChange={e => setSize(parseInt(e.target.value, 10))} className="admin-input w-full">
                {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => (
                  <option key={n} value={n}>{n} pers.</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide-sm text-ink/50">N° de table</label>
              <input value={table} onChange={e => setTable(e.target.value)}
                type="number" min="1" placeholder="—" className="admin-input w-full" />
            </div>
          </div>
          {guest.message && (
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide-sm text-ink/50">Message RSVP</label>
              <p className="rounded-xl border border-sand/40 bg-cream/60 px-4 py-3 text-sm italic text-ink/55">
                &ldquo;{guest.message}&rdquo;
              </p>
            </div>
          )}
          <div className="mt-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1" disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button type="button" onClick={onClose} className="btn-outline-dark flex-1">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────── Scanner QR ─────────── */

function QrScanner({
  onCheckin,
  guests,
}: {
  onCheckin: (id: string) => Promise<Guest | null>;
  guests: Guest[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const cooldownRef = useRef(false);
  const [camStatus, setCamStatus] = useState<"init" | "scanning" | "error">("init");
  const [lastResult, setLastResult] = useState<{ guest: Guest | null; alreadyIn: boolean } | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let active = true;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        });
        if (!active || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamStatus("scanning");
        scanFrame();
      } catch {
        setCamStatus("error");
      }
    }

    function extractId(url: string): string | null {
      const m = url.match(/\/invitation\/([0-9a-f-]{36})/i);
      return m?.[1] ?? null;
    }

    function scanFrame() {
      if (!active || !videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.readyState < video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scanFrame);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code?.data && !cooldownRef.current) {
        const id = extractId(code.data);
        if (id) {
          cooldownRef.current = true;
          const existing = guests.find(g => g.id === id) ?? null;
          if (existing?.checked_in) {
            setLastResult({ guest: existing, alreadyIn: true });
            setTimeout(() => { cooldownRef.current = false; }, 3000);
          } else {
            onCheckin(id).then(updated => {
              setLastResult({ guest: updated ?? existing, alreadyIn: false });
              setTimeout(() => { cooldownRef.current = false; }, 3000);
            });
          }
        }
      }

      rafRef.current = requestAnimationFrame(scanFrame);
    }

    startCamera();
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [onCheckin, guests]);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-sm text-ink/50">
        Pointez la caméra sur le QR code d&apos;une invitation pour enregistrer l&apos;arrivée.
      </p>

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-sand/60 bg-black shadow-2xl">
        {/* Vidéo */}
        <video ref={videoRef} className="w-full" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />

        {/* Viseur */}
        {camStatus === "scanning" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-52 w-52 rounded-2xl border-2 border-gold-light/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
        )}

        {/* États */}
        {camStatus === "init" && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep/80">
            <p className="text-sm text-cream/70">Démarrage de la caméra…</p>
          </div>
        )}
        {camStatus === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep/90 p-6 text-center">
            <p className="text-sm text-red-300">
              Impossible d&apos;accéder à la caméra.
              <br />
              <span className="text-cream/60">Vérifiez les permissions dans votre navigateur.</span>
            </p>
          </div>
        )}

        {/* Résultat scan */}
        {lastResult && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center ${
            lastResult.alreadyIn ? "bg-amber-900/90" : "bg-emerald-900/90"
          }`}>
            <div className={`text-4xl ${lastResult.alreadyIn ? "text-amber-300" : "text-emerald-300"}`}>
              {lastResult.alreadyIn ? "⚠" : "✓"}
            </div>
            <p className="font-display text-2xl text-ivory">
              {lastResult.guest?.full_name ?? "Invité inconnu"}
            </p>
            {lastResult.guest?.table_number && (
              <p className="rounded-full bg-gold/20 px-4 py-1 text-sm text-gold-light">
                Table {lastResult.guest.table_number}
              </p>
            )}
            <p className="text-sm text-cream/80">
              {lastResult.guest?.party_size} {(lastResult.guest?.party_size ?? 1) > 1 ? "personnes" : "personne"}
            </p>
            <p className={`text-xs ${lastResult.alreadyIn ? "text-amber-400" : "text-emerald-400"}`}>
              {lastResult.alreadyIn ? "Déjà enregistré(e)" : "Arrivée enregistrée"}
            </p>
          </div>
        )}
      </div>

      {camStatus === "scanning" && (
        <p className="flex items-center gap-2 text-xs text-ink/40">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Scan en cours…
        </p>
      )}
    </div>
  );
}

/* ─────────── Onglet Photos ─────────── */

const BUCKET_PREFIX = `/storage/v1/object/public/wedding-photos/`;

function PhotosTab({
  data,
  busy,
  setBusy,
  setError,
  setNotice,
  onRefresh,
}: {
  data: PhotoData | null;
  busy: boolean;
  setBusy: (v: boolean) => void;
  setError: (v: string) => void;
  setNotice: (v: string) => void;
  onRefresh: () => void;
}) {
  const davidRef = useRef<HTMLInputElement>(null);
  const manuellaRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  async function upload(file: File, folder: string, name: string) {
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    form.append("name", name);
    const res = await fetch("/api/admin/photos", { method: "POST", body: form });
    setBusy(false);
    if (!res.ok) { setError("Upload impossible."); return; }
    setNotice("Photo enregistrée ✓");
    onRefresh();
  }

  async function deletePhoto(url: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    const path = url.split(BUCKET_PREFIX)[1];
    if (!path) return;
    const res = await fetch(`/api/admin/photos/${path}`, { method: "DELETE" });
    if (!res.ok) { setError("Suppression impossible."); return; }
    setNotice("Photo supprimée ✓");
    onRefresh();
  }

  if (!data) return <p className="mt-12 text-center text-ink/40">Chargement des photos…</p>;

  const coupleSlots = [
    { label: "David", key: "david" as const, ref: davidRef, url: data.couple.david },
    { label: "Manuella", key: "manuella" as const, ref: manuellaRef, url: data.couple.manuella },
    { label: "Photo héro (accueil)", key: "hero" as const, ref: heroRef, url: data.couple.hero },
  ];

  return (
    <div className="mt-8 space-y-10">
      {/* Photos du couple */}
      <section>
        <h2 className="font-display text-2xl text-ink">Photos du couple</h2>
        <p className="mt-1 text-xs text-ink/45">Affichées dans la section « Les futurs époux » du site. La photo héro apparaît dans le bandeau d&apos;accueil.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coupleSlots.map(({ label, key, ref, url }) => (
            <div key={key} className="rounded-2xl border border-sand/50 bg-cream/50 p-5">
              <p className="mb-3 text-sm font-semibold text-ink">{label}</p>
              {url ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={label} className="h-52 w-full rounded-xl object-cover" />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => ref.current?.click()}
                      className="btn-outline-dark !px-4 !py-2 text-[0.7rem] flex-1"
                      disabled={busy}
                    >
                      Remplacer
                    </button>
                    <button
                      onClick={() => deletePhoto(url)}
                      className="rounded-full border border-red-300/60 px-4 py-2 text-xs text-red-500 hover:bg-red-50"
                      disabled={busy}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => ref.current?.click()}
                  className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sand/60 text-ink/30 transition-colors hover:border-orange/50 hover:text-ink/55"
                  disabled={busy}
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-xs">Ajouter une photo</span>
                </button>
              )}
              <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) upload(f, "couple", key); e.target.value = ""; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Galerie */}
      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-ink">Galerie</h2>
            <p className="mt-1 text-xs text-ink/45">Affichées dans la section Galerie du site.</p>
          </div>
          <button
            onClick={() => galleryRef.current?.click()}
            className="btn-gold !px-5 !py-2.5 text-[0.7rem]"
            disabled={busy}
          >
            + Ajouter
          </button>
        </div>
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            const files = Array.from(e.target.files ?? []);
            files.forEach(f => upload(f, "gallery", ""));
            e.target.value = "";
          }}
        />
        {data.gallery.length === 0 ? (
          <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-sand/50 text-ink/35">
            <p className="text-sm">Aucune photo dans la galerie</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.gallery.map((url, i) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-sand/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Galerie ${i + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => deletePhoto(url)}
                    className="rounded-full bg-red-500/80 p-2 text-white hover:bg-red-600"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────── Composants utilitaires ─────────── */

function Shell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="min-h-screen bg-ivory">
      <KenteBand />
      <div className={`mx-auto px-5 py-12 ${wide ? "max-w-5xl" : "max-w-2xl pt-24"}`}>
        {children}
      </div>
    </main>
  );
}

type SortField = "full_name" | "table_number" | "party_size" | "checked_in";

function SortTh({
  field, current, dir, onSort, className, children,
}: {
  field: SortField;
  current: SortField | null;
  dir: "asc" | "desc";
  onSort: (f: SortField) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const active = current === field;
  return (
    <th
      className={`cursor-pointer select-none hover:text-orange ${className ?? ""}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <span className={`text-[10px] ${active ? "text-orange" : "text-ink/20"}`}>
          {active ? (dir === "asc" ? "▲" : "▼") : "⇅"}
        </span>
      </span>
    </th>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-sand/50 bg-cream/50 p-5 text-center">
      <p className="font-display text-4xl text-orange">{value}</p>
      <p className="mt-1 text-[0.65rem] uppercase tracking-wide-sm text-ink/50">{label}</p>
    </div>
  );
}
