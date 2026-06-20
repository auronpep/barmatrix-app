import {
  CompetitorLandingPage,
  competitorMetadata,
  competitorPages,
} from "../competitor-pages";

const page = competitorPages.adaptibar;

export const metadata = competitorMetadata(page);

export default function AdaptiBarAlternativePage() {
  return <CompetitorLandingPage page={page} />;
}
