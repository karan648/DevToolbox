"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "devtoolbox.sidebar.open";

type SidebarContextValue = {
  isMobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }

  return context;
}

function SidebarProvider({
  children,
  defaultOpen = true,
}: React.PropsWithChildren<{ defaultOpen?: boolean }>) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateDevice = () => setIsMobile(mediaQuery.matches);

    updateDevice();
    mediaQuery.addEventListener("change", updateDevice);
    return () => mediaQuery.removeEventListener("change", updateDevice);
  }, []);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === null) return;
    setOpen(stored === "true");
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
  }, [open]);

  React.useEffect(() => {
    if (!isMobile) {
      setOpenMobile(false);
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = openMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, openMobile]);

  React.useEffect(() => {
    if (!openMobile) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMobile(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openMobile]);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
      return;
    }
    setOpen((prev) => !prev);
  }, [isMobile]);

  const value = React.useMemo(
    () => ({
      isMobile,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [isMobile, open, openMobile, toggleSidebar],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

const Sidebar = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"aside"> & {
    collapsible?: "icon" | "offcanvas";
  }
>(({ className, collapsible = "icon", children, ...props }, ref) => {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar();

  const mobileSidebar = (
    <>
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={() => setOpenMobile(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 md:hidden",
          openMobile ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        ref={ref}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r-[3px] border-black bg-slate-900 transition-transform duration-200 md:hidden",
          openMobile ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );

  const desktopSidebar = (
    <aside
      ref={ref}
      data-collapsed={String(!open)}
      className={cn(
        "group/sidebar hidden h-screen shrink-0 border-r-[3px] border-black bg-slate-900 transition-[width] duration-200 md:flex md:flex-col",
        open ? "w-72" : collapsible === "icon" ? "w-[88px]" : "w-0",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );

  return isMobile ? mobileSidebar : desktopSidebar;
});
Sidebar.displayName = "Sidebar";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex min-w-0 flex-1 flex-col", className)} {...props} />
  ),
);
SidebarInset.displayName = "SidebarInset";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, onClick, variant = "yellow", size = "icon", ...props }, ref) => {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <Button
      ref={ref}
      type="button"
      variant={variant}
      size={size}
      className={cn("shrink-0", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      aria-label="Toggle sidebar"
      {...props}
    >
      {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { isMobile, open, toggleSidebar } = useSidebar();

  if (isMobile) return null;

  return (
    <Button
      ref={ref}
      type="button"
      variant="yellow"
      size="icon"
      className={cn(
        "absolute -right-5 top-20 z-20 hidden h-10 w-10 md:inline-flex",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      aria-label="Toggle sidebar"
      {...props}
    >
      {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
    </Button>
  );
});
SidebarRail.displayName = "SidebarRail";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b-[3px] border-black p-4", className)} {...props} />
  ),
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-y-auto px-4 py-4", className)} {...props} />
  ),
);
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-t-[3px] border-black p-4", className)} {...props} />
  ),
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-5", className)} {...props} />
  ),
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "mb-2 px-2 text-[10px] font-black uppercase tracking-wider text-slate-400",
        "group-data-[collapsed=true]/sidebar:md:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-2", className)} {...props} />,
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button ref={ref} size="sm" variant="white" className={cn("h-8 px-2", className)} {...props} />
));
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cn("space-y-3", className)} {...props} />,
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("relative", className)} {...props} />,
);
SidebarMenuItem.displayName = "SidebarMenuItem";

type SidebarMenuButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  isActive?: boolean;
};

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive = false, ...props }, ref) => {
    const { isMobile, open } = useSidebar();
    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border-[3px] border-black px-3 py-3 text-left text-sm font-black uppercase transition-transform",
          isActive
            ? "bg-yellow text-black shadow-brutal"
            : "bg-slate-800 text-slate-100 hover:-translate-y-0.5 hover:bg-slate-700",
          !open && !isMobile && "justify-center px-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    size="icon"
    variant="white"
    className={cn("h-8 w-8 border-[2px] text-xs shadow-none", className)}
    {...props}
  />
));
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("ml-4 mt-2 space-y-2 border-l-[3px] border-black pl-3", className)} {...props} />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("relative", className)} {...props} />,
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { isActive?: boolean }
>(({ className, isActive = false, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "w-full rounded-lg border-[2px] border-black px-2 py-2 text-left text-xs font-black uppercase transition-colors",
      isActive ? "bg-yellow text-black" : "bg-slate-800 text-slate-200 hover:bg-slate-700",
      className,
    )}
    {...props}
  />
));
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
};
