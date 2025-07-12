"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Job } from "@prisma/client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export const CheckoutForm = ({ job }: { job: Job }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/jobs/${job.id}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button disabled={!stripe} className="mt-4">
        Submit
      </Button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};
