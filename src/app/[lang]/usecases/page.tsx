import { Metadata } from "next";
import UsecasesClient from "./UsecasesClient";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function Page() {
  return <UsecasesClient />;
}
