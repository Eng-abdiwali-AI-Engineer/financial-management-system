import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Pencil,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { api } from "../main";
import Panel from "../components/Panel";
const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n || 0,
  );
export default function Transactions({ type, title }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category:
      type === "expense"
        ? "Operating Expenses"
        : type === "sale"
          ? "Sales"
          : "Inventory",
    date: new Date().toISOString().slice(0, 10),
    reference: "",
  });
  const load = () =>
    api(`/transactions?type=${type}`).then((d) => setRows(d.transactions));
  useEffect(load, [type]);
  const save = async (e) => {
    e.preventDefault();
    try {
      await api(editing ? `/transactions/${editing}` : "/transactions", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({ ...form, type, amount: Number(form.amount) }),
      });
      setShow(false);
      setEditing(null);
      setForm({ ...form, description: "", amount: "", reference: "" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };
  const edit = (row) => { setEditing(row.id); setForm({ description: row.description, amount: row.amount, category: row.category, date: row.date, reference: row.reference || "" }); setShow(true); };
  const remove = async (id) => {
    if (confirm("Delete this transaction?")) {
      await api(`/transactions/${id}`, { method: "DELETE" });
      load();
    }
  };
  const filtered = rows.filter((r) =>
    (r.description + r.category + r.reference)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Financial records
          </p>
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track every {type} transaction.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShow(true); }}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Add {type}
        </button>
      </div>
      <Panel
        title={`${title} register`}
        subtitle={`${filtered.length} records`}
        action={
          <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-400">
            <Search size={15} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-32 bg-transparent outline-none sm:w-48"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wider text-slate-400">
                <th className="pb-3">Date</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Reference</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="group">
                  <td className="py-4 text-xs text-slate-500">{r.date}</td>
                  <td className="py-4 font-semibold">{r.description}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      {r.category}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-slate-500">
                    {r.reference || "—"}
                  </td>
                  <td
                    className={`py-4 text-right font-bold ${type === "expense" || type === "purchase" ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {type === "expense" || type === "purchase" ? "-" : "+"}
                    {money(r.amount)}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => edit(r)}
                      className="rounded-lg p-2 text-slate-300 opacity-0 hover:bg-blue-50 hover:text-blue-600 group-hover:opacity-100"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-slate-300 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="py-16 text-center text-sm text-slate-400">
              No transactions found.
            </div>
          )}
        </div>
      </Panel>
      {show && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            onSubmit={save}
            className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">{editing ? `Edit ${type}` : `Add ${type}`}</h2>
                <p className="text-xs text-slate-400">
                  {editing ? "Correct the record and save your changes." : "Create a new financial record."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setEditing(null); setShow(false); }}
                className="text-slate-400"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["description", "Description"],
                ["amount", "Amount"],
                ["category", "Category"],
                ["date", "Date"],
                ["reference", "Reference"],
              ].map(([k, l]) => (
                <label
                  key={k}
                  className={k === "description" ? "sm:col-span-2" : ""}
                >
                  <span className="mb-1.5 block text-xs font-semibold">
                    {l}
                  </span>
                  <input
                    required={["description", "amount", "date"].includes(k)}
                    type={
                      k === "amount" ? "number" : k === "date" ? "date" : "text"
                    }
                    step="0.01"
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </label>
              ))}
            </div>
            <div className="sticky bottom-0 mt-6 flex justify-end gap-2 bg-white pt-4">
              <button
                type="button"
                onClick={() => { setEditing(null); setShow(false); }}
                className="rounded-lg border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white">
                {editing ? "Save changes" : "Save transaction"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
