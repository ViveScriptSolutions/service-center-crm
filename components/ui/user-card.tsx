import Link from "next/link";
import Image from "next/image";
import type { User as PrismaUser } from "@prisma/client";

import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName } from "@/lib/utils";

export function UserCard({ user }: { user: PrismaUser }) {
  return (
    <Link href={`/users/${String(user.id)}`} className="block group">
      <Card className="transition-all group-hover:shadow-lg hover:border-primary/30">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar className="w-12 h-12">
            {user.image && (
              <AvatarImage src={user.image} alt={formatName(user.name)} />
            )}
            <AvatarFallback className="text-lg">
              {(user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-md font-semibold text-card-foreground">
              {formatName(user.name)}
            </p>
            {user.email && (
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
