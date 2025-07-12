import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./checkout-form";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createPaymentIntent } from "@/actions/jobActions";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

export default async function CheckoutPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await prisma.job.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!job) {
    notFound();
  }

  const paymentIntent = await createPaymentIntent(job.id);

  if ("error" in paymentIntent || !paymentIntent.clientSecret) {
    return <div>{paymentIntent.error || "Failed to create payment intent."}</div>;
  }

  const options = {
    clientSecret: paymentIntent.clientSecret,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm job={job} />
      </Elements>
    </div>
  );
}
