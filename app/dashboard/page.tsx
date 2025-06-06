import { auth } from "@/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function DashboardOverviewPage() {
  const session = await auth();
  // Fetch overview data here based on user role if needed

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Welcome, {session?.user?.name || "User"}!
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>Summary of your activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Content for the main dashboard overview page goes here. This could
            include stats, recent activities, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
