"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "./ClientSideProvider";
import { DashboardSidebarHeader, DashboardSidebarMain, DashboardSidebarNav, DashboardSidebarNavHeader, DashboardSidebarNavHeaderTitle, DashboardSidebarNavLink, DashboardSidebarNavMain } from "@/components/Dashboard/sidebar";
import { HomeIcon, MixerVerticalIcon } from "@radix-ui/react-icons";
import { Logo } from "@/components/Logo";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        (!sidebarOpen && !trigger.current.contains(target)) ||
        (sidebar.current.contains(target) && !trigger.current.contains(target))
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-10 flex h-screen flex-col overflow-y-hidden border-r border-border space-y-6 bg-gray-50 dark:bg-gray-900 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-72`}
    >

      <DashboardSidebarHeader>
        <Logo />
        <button
          className="absolute top-0 right-0 p-3"
          onClick={() => setSidebarOpen(false)} 
        >
          <ArrowLeftIcon className="w-8 h-8 block lg:hidden" />
        </button>
      </DashboardSidebarHeader>
      <DashboardSidebarMain className="flex flex-col flex-grow">
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink href="/app" active={isActive('/app')}>
              <HomeIcon className="w-3 h-3 mr-3" />
              Home
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/app/settings"
              active={isActive('/app/settings')}
            >
              <MixerVerticalIcon className="w-3 h-3 mr-3" />
              Configurações
            </DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>

        <DashboardSidebarNav className="mt-auto mb-6">
          <DashboardSidebarNavHeader>
            <DashboardSidebarNavHeaderTitle>
              Links extras
            </DashboardSidebarNavHeaderTitle>
          </DashboardSidebarNavHeader>

          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink href="/">
              Precisa de ajuda?
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink href="/">Site</DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
      </DashboardSidebarMain>
    </aside>
  );
};
