import {
  CompetitorLandingPage,
  competitorMetadata,
  competitorPages,
} from "../alternatives/competitor-pages";

const page = competitorPages.barbri;

export const metadata = competitorMetadata(page);

export default function BarbriMbeCompanionPage() {
  return <CompetitorLandingPage page={page} />;
}
