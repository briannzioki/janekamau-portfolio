// src/components/PdfCover.tsx
"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

type PdfCoverProps = {
  src: string;
  className?: string;
  aspect?: string; // e.g. "4/3"
};

export default function PdfCover({ src, className, aspect = "4/3" }: PdfCoverProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false as boolean;
    let renderTask: any | null = null;

    const setStatus = (status: "loading" | "rendered" | "error", error?: unknown) => {
      const c = canvasRef.current;
      if (!c) return;
      c.setAttribute("data-status", status);
      if (error) c.setAttribute("data-error", String(error));
    };

    async function loadPdfLib(): Promise<any> {
      try {
        return await import("pdfjs-dist/legacy/build/pdf");
      } catch {
        return await import("pdfjs-dist/build/pdf");
      }
    }

    const draw = async () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      setStatus("loading");

      try {
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        if (cancelled) return;

        const pdfjs: any = await loadPdfLib();

        // Use the real worker we just copied to /public
        if (pdfjs?.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.js";
        }

        // IMPORTANT: do NOT set disableWorker:true anymore.
        const loadingTask = pdfjs.getDocument({
          url: src,
          cMapUrl: "/pdfjs/cmaps/",
          cMapPacked: true,
          standardFontDataUrl: "/pdfjs/standard_fonts/",
          useSystemFonts: true,
        });

        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);

        const cssWidth = wrap.clientWidth || wrap.getBoundingClientRect().width || 800;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        const base = page.getViewport({ scale: 1 });
        const scale = Math.max(1, (cssWidth * dpr) / base.width);
        const viewport = page.getViewport({ scale });

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("2D context unavailable");

        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        canvas.style.width = `${Math.round(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.round(viewport.height / dpr)}px`;

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;

        if (!cancelled) setStatus("rendered");
      } catch (err) {
        if (!cancelled) {
          setStatus("error", err);
          // draw visible fallback
          const c = canvasRef.current;
          const ctx = c?.getContext("2d");
          if (c && ctx) {
            const w = (c.width = 600);
            const h = (c.height = 400);
            c.style.width = "300px";
            c.style.height = "200px";
            ctx.fillStyle = "#f3f4f6";
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#111827";
            ctx.font = "bold 36px system-ui, sans-serif";
            ctx.fillText("PDF preview failed", 24, 60);
          }
        }
      }
    };

    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelled = true;
      try {
        renderTask?.cancel();
      } catch {}
      window.removeEventListener("resize", onResize);
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={clsx("relative overflow-hidden", className)} style={{ aspectRatio: aspect }}>
      <canvas
        ref={canvasRef}
        className="block w-full h-auto"
        data-testid="pdf-canvas"
        data-status="loading"
      />
    </div>
  );
}
