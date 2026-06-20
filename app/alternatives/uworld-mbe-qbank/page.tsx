import {
  CompetitorLandingPage,
  competitorMetadata,
  competitorPages,
} from "../competitor-pages";

const page = competitorPages.uworld;

export const metadata = competitorMetadata(page);

export default function UWorldMbeQbankAlternativePage() {
  return <CompetitorLandingPage page={page} />;
}
