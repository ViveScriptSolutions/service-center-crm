import Link from "next/link";
import Image from "next/image";
import type { User as PrismaUser, Role } from "@prisma/client";
import { Session } from "next-auth";

import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/actions/userActions";

export function UserCard({
  user,
  session,
}: {
  user: PrismaUser;
  session: Session | null;
}) {
  const handleRoleChange = async (role: Role) => {
    "use server";
    await updateUserRole(user.id, role);
  };

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Link href={`/users/${String(user.id)}`} className="block group">
          <Avatar className="w-12 h-12">
            {user.image && (
              <AvatarImage src={user.image} alt={formatName(user.name)} />
            )}
            <AvatarFallback className="text-lg">
              {(user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link href={`/users/${String(user.id)}`} className="block group">
            <p className="text-md font-semibold text-card-foreground">
              {formatName(user.name)}
            </p>
            {user.email && (
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </Link>
        </div>
        {session?.user?.role === "ADMIN" && (
          <div>
            <Select
              defaultValue={user.role}
              onValueChange={(value) => handleRoleChange(value as Role)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
