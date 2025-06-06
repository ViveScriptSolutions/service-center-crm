import { Role } from "@prisma/client"; // Import your Role enum
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import type { AdapterUser as OriginalAdapterUser } from "@auth/core/adapters";

declare module "@auth/core/adapters" {
  interface AdapterUser extends OriginalAdapterUser {
    role: Role;
  }
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's role. */
      role: Role;
    } & DefaultSession["user"]; // Merge with default user properties
  }

  /**
   * The shape of the user object returned by the `authorize` callback
   * or the `profile` callback of an OAuth provider.
   */
  interface User extends DefaultUser {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    role?: Role;
  }
}
