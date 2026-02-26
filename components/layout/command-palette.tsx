"use client";

import { Command } from "cmdk";
import { Clock3, CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCommandPalette } from "@/hooks/use-command-palette";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { TOOL_LINKS } from "@/lib/constants";

export function CommandPalette() {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const { recent } = useRecentTools();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-20"
      onClick={() => setOpen(false)}
    >
      <Command
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border-[3px] border-black bg-slate-800 text-slate-100 shadow-brutal"
      >
        <div className="flex items-center gap-2 border-b-[3px] border-black bg-slate-900 px-4 py-3">
          <Search className="h-4 w-4 text-yellow" />
          <Command.Input
            autoFocus
            placeholder="Search tools or commands..."
            className="h-9 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-500"
          />
          <kbd className="rounded-md border-[2px] border-black bg-yellow px-2 py-1 text-[10px] font-black text-black">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[420px] overflow-y-auto p-3">
          <Command.Empty className="rounded-xl border-[3px] border-black bg-slate-900 p-4 text-sm font-semibold">
            No result found.
          </Command.Empty>

          <Command.Group heading="Tools" className="text-xs font-black uppercase text-slate-400">
            {TOOL_LINKS.map((item) => (
              <Command.Item
                key={item.href}
                value={`${item.label} ${item.href}`}
                onSelect={() => handleNavigate(item.href)}
                className="mt-2 flex cursor-pointer items-center justify-between rounded-xl border-[3px] border-black bg-slate-900 px-3 py-2 data-[selected=true]:bg-yellow data-[selected=true]:text-black"
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                <CornerDownLeft className="h-3 w-3" />
              </Command.Item>
            ))}
          </Command.Group>

          {recent.length > 0 ? (
            <Command.Group
              heading="Recent"
              className="mt-4 text-xs font-black uppercase text-slate-400"
            >
              {recent.map((item) => (
                <Command.Item
                  key={`${item.path}-${item.visitedAt}`}
                  value={`${item.name} ${item.path}`}
                  onSelect={() => handleNavigate(item.path)}
                  className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl border-[3px] border-black bg-slate-900 px-3 py-2 text-sm font-semibold data-[selected=true]:bg-blue data-[selected=true]:text-black"
                >
                  <Clock3 className="h-4 w-4" />
                  {item.name}
                </Command.Item>
              ))}
            </Command.Group>
          ) : null}
        </Command.List>
      </Command>
    </div>
  );
}
