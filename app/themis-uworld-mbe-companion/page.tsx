import {
  CompetitorLandingPage,
  competitorMetadata,
  competitorPages,
} from "../alternatives/competitor-pages";

const page = competitorPages.themis;

export const metadata = competitorMetadata(page);

export default function ThemisUWorldMbeCompanionPage() {
  return <CompetitorLandingPage page={page} />;
}
