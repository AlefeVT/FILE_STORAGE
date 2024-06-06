"use client";

import { useSidebar } from "../Sidebar/ClientSideProvider";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { UserDropDown } from "../user-dropdown";
import { useSession } from "next-auth/react";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <div className="flex-1">
        <h1 className="font-semibold text-lg">Recent Orders</h1>
      </div>

      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial w-full  flex justify-end gap-4 mr-4">
          <div className="flex">
            <button
              aria-controls="sidebar"
              className="block lg:hidden"
              onClick={toggleSidebar}
            >
              <HamburgerMenuIcon className=' w-8 h-8'/>
            </button>
          </div>
        </form>
        <UserDropDown user={session?.user}/>
      </div>
    </header>
  );
};
