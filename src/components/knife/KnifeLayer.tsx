import type { CapabilityId } from "@/lib/data/capabilities";
import { ART_MODE, rasterSrc } from "./art";
import Body from "./placeholders/Body";
import FrontScale from "./placeholders/FrontScale";
import Research from "./placeholders/Research";
import Product from "./placeholders/Product";
import Design from "./placeholders/Design";
import Code from "./placeholders/Code";
import Ai from "./placeholders/Ai";
import Gtm from "./placeholders/Gtm";

export type LayerId = CapabilityId | "body" | "front-scale";

const placeholders: Record<LayerId, React.ComponentType> = {
  body: Body,
  "front-scale": FrontScale,
  research: Research,
  product: Product,
  design: Design,
  code: Code,
  ai: Ai,
  gtm: Gtm,
};

export default function KnifeLayer({ id }: { id: LayerId }) {
  if (ART_MODE === "raster") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={rasterSrc(id)} alt="" draggable={false} loading="lazy" />;
  }
  const Placeholder = placeholders[id];
  return <Placeholder />;
}
