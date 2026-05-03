import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import "../../App.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err =
          typeof data === "object" && data !== null
            ? Object.values(data).flat().join(" ") || res.statusText
            : res.statusText;
        setStatus({ type: "error", text: err || "Something went wrong. Please try again." });
        return;
      }
      setStatus({ type: "ok", text: data.message || "Thank you. We will get back to you soon." });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus({ type: "error", text: "Network error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-50">Contact us</h1>
          <p className="text-slate-400">
            Questions about Y FI, partnerships, or privacy — send a message and we will reply by email.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-xl border border-slate-600 bg-slate-800/80 p-6 shadow-lg backdrop-blur"
        >
          <div>
            <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-slate-300">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={200}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-blue-500 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-blue-500 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-slate-300">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              minLength={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full resize-y rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-blue-500 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2"
            />
          </div>

          {status && (
            <p
              role="status"
              className={
                status.type === "ok"
                  ? "rounded-lg bg-emerald-950/60 px-3 py-2 text-sm text-emerald-300"
                  : "rounded-lg bg-red-950/60 px-3 py-2 text-sm text-red-300"
              }
            >
              {status.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
