"use client";

import { Button } from "@/components/ui/button";
import { markJobAsPickedUp } from "@/actions/jobActions";
import { useTransition } from "react";

export function PickUpButton({ jobId }: { jobId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await markJobAsPickedUp(jobId);
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? "Marking as Picked Up..." : "Mark as Picked Up"}
    </Button>
  );
}
