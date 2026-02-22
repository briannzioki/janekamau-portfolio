"use client"

import * as React from "react"

type Props = {
  fieldBase: string
}

type UiState =
  | { status: "idle"; message: "" }
  | { status: "sending"; message: "" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

export default function ContactForm({ fieldBase }: Props) {
  const [state, setState] = React.useState<UiState>({ status: "idle", message: "" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState({ status: "sending", message: "" })

    const form = e.currentTarget
    const fd = new FormData(form)

    // Keep UI the same but ensure the backend receives what it expects:
    // - projectType is taken from the services select
    // - timeframe is appended into the message so it shows up in the email
    const timeframe = String(fd.get("timeframe") ?? "").trim()
    const message = String(fd.get("message") ?? "").trim()

    if (!message) {
      setState({ status: "error", message: "Please write a message before submitting." })
      return
    }

    if (timeframe) {
      const combined = [`Timeframe: ${timeframe}`, "", message].join("\n")
      fd.set("message", combined)
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      })

      const json = (await res.json()) as { ok: boolean; error?: string }

      if (!res.ok || !json.ok) {
        setState({ status: "error", message: json.error || "Failed to send. Please try again." })
        return
      }

      form.reset()
      setState({ status: "success", message: "Message sent successfully. I’ll get back to you soon." })
    } catch {
      setState({ status: "error", message: "Network error. Please try again." })
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <label className="text-sm">
        <div className="text-[var(--text)] mb-1">Name</div>
        <input name="name" className={fieldBase} required />
      </label>

      <label className="text-sm">
        <div className="text-[var(--text)] mb-1">Email</div>
        <input type="email" name="email" className={fieldBase} required />
      </label>

      <label className="md:col-span-2 text-sm">
        <div className="text-[var(--text)] mb-1">What services are you interested in?</div>
        <select
          name="projectType"
          className={[
            fieldBase,
            "appearance-none",
          ].join(" ")}
        >
          <option>Publication layout & design</option>
          <option>Illustration</option>
          <option>Brand identity</option>
          <option>Packaging</option>
          <option>Social media templates</option>
          <option>Poster series</option>
          <option>Other</option>
        </select>
      </label>

      <label className="text-sm">
        <div className="text-[var(--text)] mb-1">Estimated timeframe</div>
        <input name="timeframe" className={fieldBase} />
      </label>

      <label className="text-sm">
        <div className="text-[var(--text)] mb-1">Budget</div>
        <input name="budget" className={fieldBase} />
      </label>

      <label className="md:col-span-2 text-sm">
        <div className="text-[var(--text)] mb-1">Message</div>
        <textarea name="message" rows={6} className={fieldBase} required />
      </label>

      <div className="md:col-span-2 flex items-center gap-3">
        <button className="btn" type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending…" : "Submit Enquiry"}
        </button>

        {state.status === "success" && (
          <div
            role="status"
            className="text-sm text-[var(--text)]"
          >
            {state.message}
          </div>
        )}

        {state.status === "error" && (
          <div
            role="alert"
            className="text-sm text-[var(--text)]"
          >
            {state.message}
          </div>
        )}
      </div>
    </form>
  )
}