
'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Mountain, LayoutDashboard, Rss, BarChart3, Settings, AlertCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Mountain className="size-6 text-primary" />
          <h1 className="text-lg font-semibold">Rockfall Sentinel</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard" asChild isActive={pathname === '/dashboard'}>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard/alerts" asChild isActive={pathname === '/dashboard/alerts'}>
              <Link href="/dashboard/alerts">
                <AlertCircle />
                Alerts
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton href="/dashboard/sensors" asChild isActive={pathname === '/dashboard/sensors'}>
              <Link href="/dashboard/sensors">
                <Rss />
                Sensors
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard/reports" asChild isActive={pathname === '/dashboard/reports'}>
              <Link href="/dashboard/reports">
                <BarChart3 />
                Reports
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="@shadcn" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Mine Operator</span>
            <span className="text-xs text-muted-foreground">operator@mine.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
