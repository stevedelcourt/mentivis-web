import { Metadata } from "next";
import BetaQuestionnaireClient from "./BetaQuestionnaireClient";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function Page() {
  return <BetaQuestionnaireClient />;
}
