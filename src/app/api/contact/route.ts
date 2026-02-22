import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  projectType: z.string().optional(),
  budget: z.string().optional(),
});

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function splitEmails(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseFrom(input: string): { email: string; name?: string } {
  const m = input.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) {
    const name = m[1]?.trim();
    const email = m[2]?.trim();
    return { email, name: name || undefined };
  }
  return { email: input.trim() };
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    let raw: any;

    if (ct.includes("application/json")) {
      raw = await req.json();
    } else {
      const fd = await req.formData();
      raw = Object.fromEntries(fd.entries());
    }

    const data = Schema.parse({
      name: raw.name,
      email: raw.email,
      message: raw.message,
      projectType: raw.projectType ?? undefined,
      budget: raw.budget ?? undefined,
    });

    // ✅ FIX: allow SMTP_PASS as fallback (your Mailtrap token is currently there)
    const token = process.env.MAILTRAP_API_TOKEN || process.env.SMTP_PASS;
    if (!token) {
      throw new Error("Missing MAILTRAP_API_TOKEN (or SMTP_PASS fallback).");
    }

    const fromRaw =
      process.env.EMAIL_FROM || "Jane Kamau <no-reply@janekamau.site>";
    const from = parseFrom(fromRaw);

    const toRaw = mustEnv("EMAIL_TO");
    const toEmails = splitEmails(toRaw);
    if (!toEmails.length) throw new Error("EMAIL_TO is empty.");

    const subject = `New message from ${data.name}`;

    const text = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.projectType ? `Project type: ${data.projectType}` : "",
      data.budget ? `Budget: ${data.budget}` : "",
      "",
      data.message,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;">
        <h2>New portfolio inquiry</h2>
        <p><b>Name:</b> ${escapeHtml(data.name)}</p>
        <p><b>Email:</b> ${escapeHtml(data.email)}</p>
        ${
          data.projectType
            ? `<p><b>Project type:</b> ${escapeHtml(data.projectType)}</p>`
            : ""
        }
        ${
          data.budget
            ? `<p><b>Budget:</b> ${escapeHtml(data.budget)}</p>`
            : ""
        }
        <p><b>Message:</b></p>
        <pre style="white-space: pre-wrap; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">${escapeHtml(
          data.message
        )}</pre>
      </div>
    `.trim();

    const payload = {
      from: { email: from.email, ...(from.name ? { name: from.name } : {}) },
      to: toEmails.map((email) => ({ email })),
      subject,
      text,
      html,
      reply_to: { email: data.email, name: data.name },
    };

    const res = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Token": token,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return Response.json(
        {
          ok: false,
          error: `Mailtrap send failed (${res.status}): ${body || res.statusText}`,
        },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send";
    return Response.json({ ok: false, error: msg }, { status: 400 });
  }
}