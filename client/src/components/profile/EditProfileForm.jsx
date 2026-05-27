import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const EditProfileForm = ({
  initial,
  onCancel,
  onSave,
  loading = false,
  error = "",
}) => {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setForm({ name: initial?.name || "", email: initial?.email || "" });
  }, [initial]);

  const validation = useMemo(() => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  }, [form]);

  const canSave = Object.keys(validation).length === 0;

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched({ name: true, email: true });
        if (!canSave) return;
        onSave({ name: form.name.trim(), email: form.email.trim() });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className="w-full rounded-2xl glass-input px-4 py-3 text-sm text-white outline-none"
            placeholder="Your name"
            disabled={loading}
          />
          {touched.name && validation.name ? (
            <p className="text-xs text-red-300">{validation.name}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className="w-full rounded-2xl glass-input px-4 py-3 text-sm text-white outline-none"
            placeholder="you@example.com"
            disabled={loading}
          />
          {touched.email && validation.email ? (
            <p className="text-xs text-red-300">{validation.email}</p>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-2xl bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/[0.07] disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || !canSave}
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/15 transition hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </motion.form>
  );
};

export default EditProfileForm;

