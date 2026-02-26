import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-[3px] border-black bg-slate-950 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4 md:px-6">
        <div>
          <p className="font-display text-lg font-black text-white">DevToolbox</p>
          <p className="mt-3 text-sm text-slate-300">
            Developer productivity suite for APIs, env files, JSON, AI debugging, and
            container commands.
          </p>
        </div>
        <div>
          <p className="text-sm font-black uppercase text-yellow">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/auth/login">Sign In</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-black uppercase text-yellow">Resources</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Documentation</li>
            <li>API Reference</li>
            <li>Changelog</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-black uppercase text-yellow">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Status: All systems operational</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
