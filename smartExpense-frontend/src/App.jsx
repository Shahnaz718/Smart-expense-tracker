import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

const COLORS = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#8b5cf6","#ec4899","#14b8a6"];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ grandTotal: 0, data: [] });
  const [view, setView] = useState("expenses"); // expenses | add | summary | categories
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({ title: "", amount: "", category: "", date: "", notes: "" });
  const [catForm, setCatForm] = useState({ name: "", color: "#6366f1", icon: "💰" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [e, c, s] = await Promise.all([
        fetch(`${API}/expenses`).then(r => r.json()),
        fetch(`${API}/categories`).then(r => r.json()),
        fetch(`${API}/expenses/summary`).then(r => r.json()),
      ]);
      setExpenses(e.data || []);
      setCategories(c.data || []);
      setSummary(s);
    } catch {
      showToast("Failed to load data", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category) {
      showToast("Please fill in all required fields", "error"); return;
    }
    try {
      const method = editExpense ? "PUT" : "POST";
      const url = editExpense ? `${API}/expenses/${editExpense._id}` : `${API}/expenses`;
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showToast(editExpense ? "Expense updated!" : "Expense added!");
      setForm({ title: "", amount: "", category: "", date: "", notes: "" });
      setEditExpense(null);
      setView("expenses");
      fetchAll();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    const res = await fetch(`${API}/expenses/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { showToast("Deleted!"); fetchAll(); }
  };

  const startEdit = (exp) => {
    setEditExpense(exp);
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category._id,
      date: exp.date?.slice(0, 10) || "",
      notes: exp.notes || "",
    });
    setView("add");
  };

  const handleAddCategory = async () => {
    if (!catForm.name) { showToast("Category name required", "error"); return; }
    const res = await fetch(`${API}/categories`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(catForm),
    });
    const data = await res.json();
    if (data.success) { showToast("Category added!"); setCatForm({ name: "", color: "#6366f1", icon: "💰" }); fetchAll(); }
    else showToast(data.message, "error");
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;
    const res = await fetch(`${API}/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { showToast("Category deleted!"); fetchAll(); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "error" ? "#ef4444" : "#10b981",
          color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ background: "#1e293b", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #334155" }}>
        <span style={{ fontSize: 28 }}>💸</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>Smart Expense Tracker</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>IT2234 – Web Services & Technology</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#6366f1", padding: "6px 16px", borderRadius: 20, fontWeight: 600, fontSize: 14 }}>
          Total: Rs. {(summary.grandTotal || 0).toLocaleString()}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 4, padding: "12px 24px", background: "#1e293b", borderBottom: "1px solid #334155" }}>
        {[["expenses","📋 Expenses"],["add","➕ Add Expense"],["summary","📊 Summary"],["categories","🏷️ Categories"]].map(([k,label]) => (
          <button key={k} onClick={() => { setView(k); if (k !== "add") { setEditExpense(null); setForm({ title:"",amount:"",category:"",date:"",notes:"" }); }}}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
              background: view === k ? "#6366f1" : "transparent", color: view === k ? "#fff" : "#94a3b8" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        {loading && <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>Loading...</div>}

        {/* EXPENSES LIST */}
        {!loading && view === "expenses" && (
          <div>
            <h2 style={{ marginBottom: 16, fontSize: 18 }}>All Expenses ({expenses.length})</h2>
            {expenses.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 60, background: "#1e293b", borderRadius: 12 }}>
                No expenses yet. Click "Add Expense" to get started!
              </div>
            ) : (
              expenses.map(exp => (
                <div key={exp._id} style={{
                  background: "#1e293b", borderRadius: 12, padding: "14px 18px", marginBottom: 10,
                  display: "flex", alignItems: "center", gap: 12, border: "1px solid #334155"
                }}>
                  <span style={{ fontSize: 24 }}>{exp.category?.icon || "💰"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{exp.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      <span style={{ background: exp.category?.color || "#6366f1", padding: "2px 8px", borderRadius: 10, color: "#fff", marginRight: 8 }}>
                        {exp.category?.name}
                      </span>
                      {new Date(exp.date).toLocaleDateString()}
                      {exp.notes && <span style={{ marginLeft: 8 }}>· {exp.notes}</span>}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#f59e0b" }}>Rs. {exp.amount.toLocaleString()}</div>
                  <button onClick={() => startEdit(exp)}
                    style={{ background: "#334155", border: "none", color: "#f1f5f9", padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>✏️</button>
                  <button onClick={() => handleDelete(exp._id)}
                    style={{ background: "#7f1d1d", border: "none", color: "#fca5a5", padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>🗑️</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ADD / EDIT FORM */}
        {view === "add" && (
          <div style={{ background: "#1e293b", borderRadius: 16, padding: 28, border: "1px solid #334155", maxWidth: 500 }}>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>{editExpense ? "✏️ Edit Expense" : "➕ Add New Expense"}</h2>
            {[
              { label: "Title *", key: "title", type: "text", placeholder: "e.g. Lunch at canteen" },
              { label: "Amount (Rs.) *", key: "amount", type: "number", placeholder: "e.g. 350" },
              { label: "Date", key: "date", type: "date", placeholder: "" },
              { label: "Notes", key: "notes", type: "text", placeholder: "Optional note" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", marginBottom: 5, fontSize: 13, color: "#94a3b8" }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 5, fontSize: 13, color: "#94a3b8" }}>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 14 }}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleSubmit}
                style={{ flex: 1, padding: "12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                {editExpense ? "Update Expense" : "Add Expense"}
              </button>
              <button onClick={() => { setView("expenses"); setEditExpense(null); setForm({ title:"",amount:"",category:"",date:"",notes:"" }); }}
                style={{ padding: "12px 18px", background: "#334155", color: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {!loading && view === "summary" && (
          <div>
            <h2 style={{ marginBottom: 16, fontSize: 18 }}>📊 Spending Summary</h2>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #334155" }}>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>Grand Total Spent</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#f59e0b" }}>Rs. {(summary.grandTotal || 0).toLocaleString()}</div>
            </div>
            {(summary.data || []).map(item => {
              const pct = summary.grandTotal > 0 ? ((item.total / summary.grandTotal) * 100).toFixed(1) : 0;
              return (
                <div key={item._id} style={{ background: "#1e293b", borderRadius: 12, padding: "14px 18px", marginBottom: 10, border: "1px solid #334155" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span>{item.category.icon}</span>
                    <span style={{ fontWeight: 600 }}>{item.category.name}</span>
                    <span style={{ marginLeft: "auto", fontWeight: 700, color: "#f59e0b" }}>Rs. {item.total.toLocaleString()}</span>
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>{pct}%</span>
                  </div>
                  <div style={{ background: "#0f172a", borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: item.category.color, borderRadius: 4, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{item.count} transaction{item.count !== 1 ? "s" : ""}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* CATEGORIES */}
        {!loading && view === "categories" && (
          <div>
            <h2 style={{ marginBottom: 16, fontSize: 18 }}>🏷️ Manage Categories</h2>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #334155" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div>
                  <label style={{ display: "block", marginBottom: 5, fontSize: 13, color: "#94a3b8" }}>Name *</label>
                  <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                    placeholder="e.g. Food" style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 5, fontSize: 13, color: "#94a3b8" }}>Icon</label>
                  <input value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", width: 60, textAlign: "center" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 5, fontSize: 13, color: "#94a3b8" }}>Color</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {COLORS.map(c => (
                      <div key={c} onClick={() => setCatForm({ ...catForm, color: c })}
                        style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer",
                          border: catForm.color === c ? "3px solid #fff" : "2px solid transparent" }} />
                    ))}
                  </div>
                </div>
                <button onClick={handleAddCategory}
                  style={{ padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                  Add
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {categories.map(cat => (
                <div key={cat._id} style={{ background: "#1e293b", borderRadius: 12, padding: 16, border: `2px solid ${cat.color}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: cat.color }}>{cat.color}</div>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat._id)}
                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
