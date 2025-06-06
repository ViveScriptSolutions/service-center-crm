import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-extrabold text-red-600">Access Denied</h1>
        <p className="mt-2 text-lg text-gray-600">
          You do not have the necessary permissions to access this page.
        </p>
        <Link href="/" passHref>
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    </div>
  );
}
