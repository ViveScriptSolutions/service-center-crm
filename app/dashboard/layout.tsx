import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Users,
  UserCog,
  User,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/ui/user-menu";
import { Role } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: Role[]; // Roles that can see this item. If undefined, all authenticated users.
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  {
    href: "/dashboard/technicians",
    label: "Technicians",
    icon: UserCog,
    roles: [Role.ADMIN], // Only admins can see this
  },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

async function SidebarNav() {
  const session = await auth();
  const userRole = session?.user?.role;

  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => {
        if (item.roles && userRole && !item.roles.includes(userRole)) {
          return null;
        }
        return (
          <Button
            key={item.href}
            variant="ghost"
            className="justify-start"
            asChild
          >
            <Link href={item.href} className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login"); // Should be handled by middleware, but good as a fallback
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background fixed">
        <div className="p-4 border-b">
          <Link href="/dashboard" className="text-xl font-bold">
            CRM Dashboard
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2">
          <SidebarNav />
        </ScrollArea>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-64 w-full">
        {" "}
        {/* sm:pl-14 for collapsed sidebar on mobile */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-end">
          {/* Mobile nav trigger can be added here */}
          <UserMenu user={session.user} />
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </div>
    </div>
  );
}
