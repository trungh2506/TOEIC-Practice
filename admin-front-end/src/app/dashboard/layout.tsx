"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import RequireAuth from "@/components/require-auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, isAdmin } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else router.push("/");
  }, []);
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ModeToggle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
