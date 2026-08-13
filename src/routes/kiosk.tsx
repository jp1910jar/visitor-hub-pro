import { createFileRoute } from "@tanstack/react-router";
import { VisitorPortal } from "@/components/visitor/VisitorPortal";

const title = "Reception Kiosk — Avertech Visitor Portal";
const description =
  "Touch-friendly reception kiosk for Avertech visitors. Select new or returning visitor to begin check-in.";

export const Route = createFileRoute("/kiosk")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: KioskPage,
});

function KioskPage() {
  return <VisitorPortal kiosk />;
}
