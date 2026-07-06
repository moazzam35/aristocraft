import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const start = Date.now();
    const res = await fetch("https://www.google.com", { signal: AbortSignal.timeout(8000) });
    results.googleFetch = { ok: res.ok, status: res.status, ms: Date.now() - start };
  } catch (e: unknown) {
    results.googleFetch = { error: (e as Error).message };
  }

  try {
    const start = Date.now();
    const res = await fetch("https://ep-holy-cell-at9wlgf7-pooler.c-9.us-east-1.aws.neon.tech", {
      signal: AbortSignal.timeout(8000),
    });
    results.neonHttpsFetch = { ok: res.ok, status: res.status, ms: Date.now() - start };
  } catch (e: unknown) {
    results.neonHttpsFetch = { error: (e as Error).message };
  }

  try {
    const net = await import("net");
    const start = Date.now();
    const socketResult = await new Promise((resolve) => {
      const socket = net.createConnection({
        host: "ep-holy-cell-at9wlgf7-pooler.c-9.us-east-1.aws.neon.tech",
        port: 443,
        timeout: 8000,
      });
      socket.on("connect", () => {
        socket.end();
        resolve({ connected: true, ms: Date.now() - start });
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve({ connected: false, error: "timeout" });
      });
      socket.on("error", (err) => {
        resolve({ connected: false, error: err.message });
      });
    });
    results.neonPort443Raw = socketResult;
  } catch (e: unknown) {
    results.neonPort443RawError = (e as Error).message;
  }

  try {
    const net = await import("net");
    const start = Date.now();
    const socketResult = await new Promise((resolve) => {
      const socket = net.createConnection({
        host: "ep-holy-cell-at9wlgf7-pooler.c-9.us-east-1.aws.neon.tech",
        port: 5432,
        timeout: 8000,
      });
      socket.on("connect", () => {
        socket.end();
        resolve({ connected: true, ms: Date.now() - start });
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve({ connected: false, error: "timeout" });
      });
      socket.on("error", (err) => {
        resolve({ connected: false, error: err.message });
      });
    });
    results.neonPort5432Raw = socketResult;
  } catch (e: unknown) {
    results.neonPort5432RawError = (e as Error).message;
  }

  return NextResponse.json(results);
}