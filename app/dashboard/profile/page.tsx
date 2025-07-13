"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFormState } from "react-dom"; // Import useFormState
import { useEffect, useState } from "react"; // For managing user data on client
import { User } from "@prisma/client"; // Import User type
import type { ProfileFormState } from "@/lib/types/formStates"; // Import the type
import { updateProfile } from "@/actions/userActions"; // Import the server action

const initialState: ProfileFormState = {
  message: null,
  error: null,
  success: null,
  details: null,
};

export default function ProfilePage() {
  // useFormState hook
  const [state, formAction] = useFormState(updateProfile, initialState);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    // Fetch user data on the client side
    // This is necessary because the page is now a client component
    // and we can't directly use async/await for prisma in the main component body.
    const fetchUser = async () => {
      setIsLoadingUser(true);
      try {
        // In a real app, you might have an API route or a client-callable server action for this
        const response = await fetch("/api/user/profile"); // Example API endpoint
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Handle error, e.g., redirect or show error message
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div>
        {isLoadingUser ? "Loading profile..." : "Failed to load profile."}
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            View and update your personal information.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? "User"}
                />
                <AvatarFallback>
                  {(user.name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <Label htmlFor="image">Profile Picture URL</Label>
                <Input
                  id="image"
                  name="image"
                  defaultValue={user.image ?? ""}
                  placeholder="https://example.com/your-image.png"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={user.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (cannot be changed)</Label>
              <Input
                id="email"
                type="email"
                value={user.email ?? ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role (cannot be changed)</Label>
              <Input id="role" value={user.role} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" aria-disabled={isLoadingUser}>
              Save Changes
            </Button>
            {state?.error && (
              <p className="ml-4 text-sm text-destructive">{state.error}</p>
            )}
            {state?.success && (
              <p className="ml-4 text-sm text-emerald-500">{state.success}</p>
            )}
            {state?.message && (
              <p className="ml-4 text-sm text-muted-foreground">
                {state.message}
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
