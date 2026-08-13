import { createFileRoute } from "@tanstack/react-router";
import { VisitorPortal } from "@/components/visitor/VisitorPortal";

const title = "Avertech Visitor Portal — Check In Securely";
const description =
  "Register your visit, verify with OTP, and check in at Avertech in under two minutes. Returning visitors can retrieve their profile instantly.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return <VisitorPortal />;
}
