import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { auth } from "@/auth";
import { UserMenu } from "@/components/ui/user-menu";
import { UserCard } from "@/components/ui/user-card";
import prisma from "@/lib/prisma";
import { SignInButton } from "@/components/ui/SignInButton";

export default async function Home() {
  noStore();

  const session = await auth();
  console.log(session);

  // limit to 100 users and cache for 60 seconds.
  const users = await prisma.user.findMany({
    take: 100,
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Superblog
          </Link>{" "}
          {/* You can style this with text-foreground if you like */}
          <div>
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 font-[family-name:var(--font-geist-sans)]">
            Service Center CRM
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A demo application showcasing the power of Prisma Postgres and
            Next.js
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Community Members
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
