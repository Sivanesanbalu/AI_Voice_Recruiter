"use client"
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // ✅ Correct Link import
import { usePathname } from "next/navigation";

export function AppSidebar() {

    const path=usePathname();
    console.log(path);
    return (
        <Sidebar>
        <SidebarHeader className="flex items-center mt-5">
            <Image
            src={"/logo.png"}
            alt="logo"
            width={200}
            height={100}
            className="w-[150px] h-[150px]"
            />
            <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New Interview
            </Button>
        </SidebarHeader>

        <SidebarContent>
            <SidebarGroup>
            <SidebarContent>
                <SidebarMenu>
                {SideBarOptions.map((option, index) => (
                    <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild className={`p-5 ${path==option.path && 'bg-blue-100'}`}>
                        <Link href={option.path} className="flex items-center gap-4">
                        <option.icon className={`${path==option.path&&'text-primary'}`} />
                        <span className={`text-[16px] font-medium ${path==option.path&&'text-primary'}`}>{option.name}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarContent>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter />
        </Sidebar>
    );
}
