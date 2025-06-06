"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (type === "signup") {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        await signIn("credentials", {
          email,
          password,
          callbackUrl: callbackUrl, // Use dynamic callbackUrl
        });
      } else {
        alert("Signup failed");
      }
    } else {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: callbackUrl, // Use dynamic callbackUrl
        redirect: false,
      });
      if (res?.error) alert("Login failed");
      else router.push(callbackUrl); // Use dynamic callbackUrl
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <CardContent className="space-y-4">
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : type === "signup" ? "Sign Up" : "Login"}
        </Button>

        <Button variant="link" asChild className="font-normal">
          {type === "signup" ? (
            <Link href="/login">Already have an account? Sign In</Link>
          ) : (
            <Link href="/signup">Need to create an account? Sign Up</Link>
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
