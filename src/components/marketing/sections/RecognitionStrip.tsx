import { Coffee, Croissant, Store, Truck, Utensils } from "lucide-react";
import { Container } from "@/components/marketing/ui/Container";

// Text and minimal icons, not fake customer logos. F&B only for V1 — no
// other verticals implied here.
const businessTypes = [
  { label: "Coffee Shops", icon: Coffee },
  { label: "Restaurants", icon: Utensils },
  { label: "Bakeries", icon: Croissant },
  { label: "Food Trucks", icon: Truck },
  { label: "Small Hospitality Businesses", icon: Store },
];

export function RecognitionStrip() {
  return (
    <section className="border-y border-mkt-border-light bg-mkt-bg-secondary py-10">
      <Container>
        <p className="text-center text-sm font-medium text-mkt-text-muted">
          Built for the owner making a hundred decisions a day.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {businessTypes.map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2 text-mkt-text-secondary">
              <Icon className="h-4 w-4 text-brand-teal" strokeWidth={1.75} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
