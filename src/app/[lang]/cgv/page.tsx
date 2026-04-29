"use client";
import PageShell from "@/components/layout/PageShell";
import LegalPageLayout from "@/components/ui/LegalPageLayout";
import { useMessages } from "@/lib/messages";

export default function CgvPage() {
  const { lang } = useMessages();

  const content = lang === "fr" ? {
    title: "Conditions generales de vente",
    date: "Derniere mise a jour : 27 avril 2026",
    sections: [
      {
        title: "Article 1 - Objet et Champ d'Application",
        blocks: [
          { type: "paragraph" as const, text: "Les presentes Conditions Generales de Vente (CGV) regissent l'ensemble des prestations de conseil, d'accompagnement, de structuration, de sourcing, de placement et de pilotage commercial fournies par Mentivis SAS (ci-apres \"Mentivis\") a ses clients professionnels (ci-apres le \"Client\")." },
          { type: "paragraph" as const, text: "Elles constituent le socle contractuel unique de la relation commerciale. Toute acceptation d'une proposition commerciale implique l'adhesion pleine et entiere aux presentes CGV, qui prevalent sur tout document du Client, sauf accord express et ecrit de Mentivis." },
        ],
      },
      {
        title: "Article 2 - Formation et Evolution du Contrat",
        blocks: [
          { type: "paragraph" as const, text: "Le contrat est forme a reception par Mentivis d'une proposition commerciale signee par le Client, le cas echeant accompagnee d'un bon de commande." },
          { type: "paragraph" as const, text: "Toute modification du perimetre, des livrables ou du calendrier fait l'objet d'un avenant ecrit prealable." },
          { type: "paragraph" as const, text: "Les propositions sont valables trente (30) jours sauf mention contraire." },
        ],
      },
      {
        title: "Article 3 - Nature des Prestations",
        blocks: [
          { type: "paragraph" as const, text: "Les prestations peuvent inclure, selon la proposition commerciale :" },
          { type: "list" as const, items: [
            "Forfait mensuel : pilotage strategique, production de livrables, gouvernance, mise en oeuvre operationnelle",
            "Success fees / commissions : declenches par la realisation d'evenements precisement definis (inscription validee, contrat signe, lead qualifie, etc.)",
            "Frais annexes : refactures au reel ou pris en charge directement par le Client",
          ]},
          { type: "paragraph" as const, text: "Les evenements declencheurs des success fees sont definis contractuellement et font foi, y compris en cas de contestation." },
        ],
      },
      {
        title: "Article 4 - Conditions Financieres",
        blocks: [
          { type: "paragraph" as const, text: "Prix : Les prix sont exprimes hors taxes. Toute taxe applicable est facturee en sus. Les conditions financieres definies dans la proposition sont fermes sur la duree de la mission." },
          { type: "paragraph" as const, text: "Modalites de paiement :" },
          { type: "list" as const, items: [
            "Les forfaits sont payables d'avance (premier mois a la commande, puis mensuellement en debut de periode)",
            "Les success fees sont dus des realisation de l'evenement declencheur, independamment de tout encaissement par le Client",
            "Les frais sont factures mensuellement sur justificatifs",
          ]},
          { type: "paragraph" as const, text: "Delais de paiement : Sauf disposition contraire, les factures sont payables a trente (30) jours date d'emission." },
          { type: "paragraph" as const, text: "Retard de paiement : Tout retard entraine automatiquement des penalites au taux BCE + 10 points, une indemnite forfaitaire de 40 EUR, et le remboursement des frais de recouvrement engages." },
          { type: "paragraph" as const, text: "Suspension des prestations : En cas d'impaye, Mentivis peut suspendre immediatement ses interventions apres mise en demeure restee sans effet sous huit (8) jours ouvres. Cette suspension n'exonere pas le Client de ses obligations financieres." },
        ],
      },
      {
        title: "Article 5 - Obligations des Parties",
        blocks: [
          { type: "paragraph" as const, text: "Mentivis : Mentivis execute ses missions selon une obligation de moyens, conformement aux standards du conseil. Aucune garantie de resultat n'est donnee, notamment en matiere de volume d'inscriptions, signatures commerciales ou levees de financement. Ces resultats dependent de facteurs externes hors du controle de Mentivis." },
          { type: "paragraph" as const, text: "Client : Le Client s'engage a fournir les informations et acces necessaires dans des delais compatibles avec la mission, designer un interlocuteur decisionnaire, valider les livrables dans les delais, et regler les factures a echeance. Tout retard imputable au Client entraine automatiquement un decalage des delais, sans responsabilite de Mentivis." },
        ],
      },
      {
        title: "Article 6 - Confidentialite",
        blocks: [
          { type: "paragraph" as const, text: "Chaque partie s'engage a conserver strictement confidentielles les informations echangees. Cette obligation s'applique pendant la mission et pendant trois (3) ans apres sa fin." },
        ],
      },
      {
        title: "Article 7 - Propriete Intellectuelle",
        blocks: [
          { type: "paragraph" as const, text: "Les methodes, outils, modeles, frameworks et savoir-faire de Mentivis restent sa propriete exclusive. Les livrables specifiques sont concetes au Client pour un usage interne, apres paiement integral. Toute diffusion, reproduction ou exploitation externe est interdite sans accord ecrit." },
        ],
      },
      {
        title: "Article 8 - Responsabilite",
        blocks: [
          { type: "paragraph" as const, text: "La responsabilite de Mentivis est strictement limitee au montant des honoraires effectivement perçus au titre de la mission concernee. Sont exclus : pertes de chiffre d'affaires, pertes de marge, pertes d'opportunite, dommages indirects. Mentivis ne peut etre tenue responsable des donnees erronees fournies par le Client, des decisions prises par le Client, ou des evenements de force majeure." },
        ],
      },
      {
        title: "Article 9 - Resiliation",
        blocks: [
          { type: "paragraph" as const, text: "Manquement : En cas de manquement grave, le contrat peut etre resilie apres mise en demeure restee sans effet sous quinze (15) jours ouvres." },
          { type: "paragraph" as const, text: "Resiliation a l'initiative du Client : Preavis de trente (30) jours. Sont dus l'integralite des forfaits engages, les success fees acquis ou en cours de realisation, les frais engages, et une indemnite de resiliation equivalente a un (1) mois de forfait ou 20 % du solde restant pour une mission a duree determinee." },
          { type: "paragraph" as const, text: "Force majeure : En cas de force majeure superieure a soixante (60) jours, chaque partie peut resilier sans indemnite." },
        ],
      },
      {
        title: "Article 10 - Non-sollicitation et Non-contournement",
        blocks: [
          { type: "paragraph" as const, text: "Le Client s'interdit de recruter ou solliciter les intervenants de Mentivis, et de contourner Mentivis pour contractualiser directement avec des contacts introduits. Duree : pendant la mission + douze (12) mois. Toute violation entraine une indemnite forfaitaire equivalente a six (6) mois de remuneration ou de valeur generee." },
        ],
      },
      {
        title: "Article 11 - Donnees personnelles",
        blocks: [
          { type: "paragraph" as const, text: "Les donnees sont traitees uniquement pour l'execution de la mission, conformement a la reglementation en vigueur." },
        ],
      },
      {
        title: "Article 12 - Droit applicable et litiges",
        blocks: [
          { type: "paragraph" as const, text: "Les CGV sont regies par le droit francais. Les parties s'engagent a rechercher une solution amiable pendant trente (30) jours. A defaut, competence exclusive est attribuee au Tribunal de commerce de Paris." },
        ],
      },
      {
        title: "Article 13 - Dispositions generales",
        blocks: [
          { type: "list" as const, items: [
            "Nullite partielle sans effet sur le reste",
            "Absence de renonciation",
            "Integralite contractuelle",
            "Cession interdite sans accord prealable",
          ]},
        ],
      },
    ],
  } : {
    title: "General Terms and Conditions of Sale",
    date: "Last updated: April 27, 2026",
    sections: [
      {
        title: "1. Scope and Applicability",
        blocks: [
          { type: "paragraph" as const, text: 'These General Terms and Conditions of Sale (the "Agreement") govern all consulting, advisory, sourcing, placement, and commercial management services provided by Mentivis SAS ("Mentivis") to any business customer (the "Client").' },
          { type: "paragraph" as const, text: "This Agreement constitutes the entire and exclusive agreement between the parties with respect to its subject matter and supersedes all prior or contemporaneous agreements, proposals, or communications. Any acceptance of a proposal issued by Mentivis constitutes acceptance of this Agreement. Any additional or conflicting terms proposed by the Client are expressly rejected unless agreed to in writing by Mentivis." },
        ],
      },
      {
        title: "2. Formation of the Agreement",
        blocks: [
          { type: "paragraph" as const, text: "This Agreement becomes binding upon Mentivis' receipt of a proposal duly executed by the Client, and, where applicable, a corresponding purchase order." },
          { type: "paragraph" as const, text: "Any modification to the scope of services must be set forth in a written amendment signed by both parties." },
          { type: "paragraph" as const, text: "Unless otherwise stated, proposals remain valid for thirty (30) days from the date of issuance." },
        ],
      },
      {
        title: "3. Services",
        blocks: [
          { type: "paragraph" as const, text: "Mentivis may provide services including, but not limited to:" },
          { type: "list" as const, items: [
            "Fixed Fees: Monthly retainers covering project management, deliverables, governance, and operational implementation.",
            "Success Fees: Performance-based fees triggered upon the occurrence of defined events (e.g., executed agreements, validated leads, completed applications), as specified in the applicable proposal.",
            "Reimbursable Expenses: Travel, media purchases, and third-party costs, billed at cost with reasonable documentation, unless otherwise managed directly by the Client.",
          ]},
          { type: "paragraph" as const, text: "Triggering events for success fees shall be defined in the applicable proposal and shall be binding." },
        ],
      },
      {
        title: "4. Fees and Payment Terms",
        blocks: [
          { type: "paragraph" as const, text: "Fees: All fees are stated in euros or U.S. dollars, exclusive of taxes. Applicable taxes, including VAT or sales tax, will be added as required by law. Fees set forth in a signed proposal are fixed for the duration of the engagement." },
          { type: "paragraph" as const, text: "Payment Terms:" },
          { type: "list" as const, items: [
            "Fixed fees are payable upon execution (first month) and thereafter monthly in advance, unless otherwise specified.",
            "Success fees are invoiced upon occurrence of the applicable triggering event and are payable within fifteen (15) days of invoice date.",
            "Reimbursable expenses are invoiced monthly.",
          ]},
          { type: "paragraph" as const, text: "Late Payments: Any amounts not paid when due shall accrue interest at the rate of 1.5% per month (or the maximum rate permitted by law, if lower), from the due date until paid. The Client shall reimburse Mentivis for all reasonable costs incurred in collecting overdue amounts, including attorneys' fees, to the extent permitted by law." },
          { type: "paragraph" as const, text: "Suspension of Services: Mentivis reserves the right to suspend performance upon written notice if any undisputed invoice remains unpaid for more than eight (8) business days after notice of non-payment." },
        ],
      },
      {
        title: "5. Obligations of the Parties",
        blocks: [
          { type: "paragraph" as const, text: "Mentivis: Mentivis shall perform the services in a professional and workmanlike manner consistent with generally accepted industry standards. ALL SERVICES ARE PROVIDED ON A BEST-EFFORTS BASIS. MENTIVIS DOES NOT WARRANT OR GUARANTEE ANY SPECIFIC OUTCOME OR RESULT." },
          { type: "paragraph" as const, text: "Client: The Client shall provide all necessary information, materials, and access in a timely manner; designate a qualified point of contact with decision-making authority; review and approve deliverables without undue delay; and pay all fees when due. Mentivis shall not be liable for delays caused by the Client's failure to meet its obligations." },
        ],
      },
      {
        title: "6. Confidentiality and Intellectual Property",
        blocks: [
          { type: "paragraph" as const, text: "Confidentiality: Each party agrees to maintain in confidence all non-public, proprietary, or confidential information disclosed by the other party and to use such information solely for purposes of this Agreement. This obligation shall survive for three (3) years following termination." },
          { type: "paragraph" as const, text: "Intellectual Property: Mentivis retains all rights, title, and interest in its pre-existing materials, methodologies, tools, and know-how. Upon full payment, the Client is granted a non-exclusive, non-transferable license to use deliverables created specifically for the Client for its internal business purposes. The Client shall not disclose, distribute, or commercialize such deliverables without prior written consent." },
        ],
      },
      {
        title: "7. Limitation of Liability",
        blocks: [
          { type: "paragraph" as const, text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW:" },
          { type: "list" as const, items: [
            "MENTIVIS' TOTAL LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY THE CLIENT FOR THE SERVICES GIVING RISE TO THE CLAIM.",
            "IN NO EVENT SHALL MENTIVIS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, REVENUE, OR BUSINESS OPPORTUNITY.",
          ]},
          { type: "paragraph" as const, text: "Mentivis shall not be liable for any failure or delay resulting from inaccurate or incomplete information provided by the Client or from events beyond its reasonable control." },
        ],
      },
      {
        title: "8. Term and Termination",
        blocks: [
          { type: "paragraph" as const, text: "Termination for Cause: Either party may terminate this Agreement upon written notice if the other party materially breaches its obligations and fails to cure such breach within fifteen (15) business days after receipt of notice." },
          { type: "paragraph" as const, text: "Termination for Convenience (Client): The Client may terminate the engagement upon thirty (30) days' prior written notice. In such case, all accrued fees and success fees remain due and payable; all non-cancellable expenses shall be reimbursed; and a termination fee equal to one (1) month of fees (or 20% of the remaining contract value for fixed-term engagements) shall be due." },
          { type: "paragraph" as const, text: "Force Majeure: Neither party shall be liable for failure or delay caused by events beyond reasonable control, including but not limited to acts of God, war, strikes, or governmental actions. If such event continues for more than sixty (60) days, either party may terminate this Agreement upon written notice." },
        ],
      },
      {
        title: "9. Non-Solicitation",
        blocks: [
          { type: "paragraph" as const, text: "During the term of the engagement and for twelve (12) months thereafter, the Client shall not directly or indirectly solicit, hire, or engage any personnel introduced by Mentivis. In the event of breach, the Client shall pay liquidated damages equal to six (6) months of the individual's gross compensation." },
        ],
      },
      {
        title: "10. Data Protection",
        blocks: [
          { type: "paragraph" as const, text: "Mentivis processes personal data solely for the purpose of performing this Agreement and managing the business relationship, in compliance with applicable data protection laws." },
        ],
      },
      {
        title: "11. Governing Law and Dispute Resolution",
        blocks: [
          { type: "paragraph" as const, text: "This Agreement shall be governed by and construed in accordance with the laws of the State of New York, without regard to conflict of law principles. Any dispute arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts located in New York County, New York." },
        ],
      },
      {
        title: "12. Miscellaneous",
        blocks: [
          { type: "list" as const, items: [
            "Severability: If any provision is held invalid, the remaining provisions shall remain in full force and effect.",
            "Waiver: Failure to enforce any provision shall not constitute a waiver.",
            "Entire Agreement: This Agreement, together with the applicable proposal, constitutes the entire agreement between the parties.",
            "Assignment: The Client may not assign this Agreement without prior written consent of Mentivis.",
          ]},
        ],
      },
    ],
  };

  return (
    <PageShell>
      <LegalPageLayout title={content.title} date={content.date} sections={content.sections} />
    </PageShell>
  );
}
