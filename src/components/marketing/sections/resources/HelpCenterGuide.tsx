import { HelpCenterEntry } from "./HelpCenterEntry";
import { helpCenterEntries } from "@/content/help-center";

// Renders all Help Center guides, alternating mockup side + background the
// same way the homepage/Product page alternate their four showcases.
export function HelpCenterGuide() {
  return (
    <>
      {helpCenterEntries.map((entry, index) => (
        <HelpCenterEntry
          key={entry.label}
          entry={entry}
          mockupSide={index % 2 === 0 ? "right" : "left"}
          background={index % 2 === 0 ? "primary" : "secondary"}
        />
      ))}
    </>
  );
}
