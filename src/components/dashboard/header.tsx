
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Bell, AlertCircle, Clock, PanelLeft } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { mockAlerts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function DashboardHeader() {
  const alertCount = mockAlerts.length;

  const severityIconMap: { [key: string]: React.ElementType } = {
    High: () => <AlertCircle className="size-4 text-destructive" />,
    Medium: () => <AlertCircle className="size-4 text-accent" />,
    Low: () => <AlertCircle className="size-4 text-primary" />,
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <SidebarTrigger />

      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-sm font-semibold text-green-500">KAVACH Online</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-xs">
                {alertCount}
              </Badge>
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 md:w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
                <span>Recent Alerts</span>
                <Link href="/dashboard/alerts" className="text-xs font-normal text-primary hover:underline">
                    View all
                </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <TooltipProvider>
                {mockAlerts.slice(0,4).map((alert) => {
                    const Icon = severityIconMap[alert.severity];
                    return (
                        <DropdownMenuItem key={alert.id} asChild>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/dashboard/alerts" className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-md">
                                        <div className="mt-1">
                                             <Icon />
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <p className="text-sm font-medium leading-none">{alert.location}</p>
                                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                                        </div>
                                    </Link>
                                 </TooltipTrigger>
                                 <TooltipContent side="left">
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-4" />
                                        <span>{alert.timestamp}</span>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </DropdownMenuItem>
                    );
                })}
            </TooltipProvider>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/seed/user/100/100" />
              <AvatarFallback>MO</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
