import {
  CompetitorLandingPage,
  competitorMetadata,
  competitorPages,
} from "../competitor-pages";

const page = competitorPages.qbank;

export const metadata = competitorMetadata(page);

export default function MbeQuestionBankAlternativesPage() {
  return <CompetitorLandingPage page={page} />;
}
