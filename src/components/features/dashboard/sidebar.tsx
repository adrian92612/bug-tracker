"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { GrOverview, GrProjects } from "react-icons/gr";
import { IoIosArrowDropright } from "react-icons/io";
import { IoTicketOutline } from "react-icons/io5";

const links = [
  {
    icon: <GrOverview />,
    label: "Overview",
    href: "/dashboard/overview",
  },
  {
    icon: <FaUsers />,
    label: "User Management",
    href: "/dashboard/users",
  },
  {
    icon: <GrProjects />,
    label: "Projects",
    href: "/dashboard/projects",
  },
  {
    icon: <IoTicketOutline />,
    label: "Tickets",
    href: "/dashboard/tickets",
  },
];

const SideBarLinks = () => {
  const pathname = usePathname();
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className={cn(
              "w-full overflow-hidden flex items-center gap-3 pl-3 h-10 transition duration-300",
              pathname.startsWith(link.href)
                ? "bg-slate-800 text-slate-100 font-bold"
                : ""
            )}
          >
            <span className="text-2xl">{link.icon}</span>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const SideBarSheet = () => {
  return (
    <div className="flex items-center md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-5xl text-slate-50 hover:text-slate-800"
          >
            <IoIosArrowDropright />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="px-0 pt-10 w-52 border-slate-800 overflow-hidden"
        >
          <h1 className="font-bold mb-5 text-center">ProjectSync</h1>

          <SideBarLinks />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className={cn(
        isOpen ? "w-52" : "w-12",
        "hidden md:flex flex-col overflow-hidden shadow-md shadow-slate-600 bg-white sticky top-[56px] h-[calc(100dvh-56px)] transition-width duration-300"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto text-3xl my-2 mr-2 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoIosArrowDropright
          className={cn(
            isOpen ? "rotate-180" : "",
            "transition-transform duration-300"
          )}
        />
      </Button>
      <SideBarLinks />
    </div>
  );
};
