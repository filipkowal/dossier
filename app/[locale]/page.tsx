import Button from "@/components/Button";
import { Locale } from "@/i18n-config";
import InviteSection from "./InviteSection";
import { getDictionary } from "@/utils/server";

export default async function Home({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <div className="w-full grid grid-cols-[minmax(250px,1fr),2fr] pt-16">
      <div className="flex flex-col bg-digitalent-blue text-white items-end">
        <div className="flex flex-col justify-end h-[34vh] 3xl:h-[20vh] pt-16 px-32 w-[35rem]">
          <div className="rounded-full w-52 h-52 bg-digitalent-yellow" />
        </div>
        <div className="flex flex-col mt-16 px-32 w-[35rem]">
          <h2 className="text-xl font-title mb-8">
            {dict.candidate.contactDetails}
          </h2>
          <p>+48 601 299 200</p>
          <p>filip.kowal@protonmail.com</p>
          <p>linkedin.com/in/filip-kowal-8a4a3767</p>
          <h2 className="text-xl font-title my-8">
            {dict.candidate.personalDetails}
          </h2>
          <p>24.09.1992 (31 y/o)</p>
          <p>Wymyślona Street 26, Kraków </p>
          <h2 className="text-xl font-title my-8">
            {dict.candidate.languages}
          </h2>
          <p>English: Fluent - C1</p>
          <p>Polish: Native - C2</p>
          <p>Kx’a: None - A0</p>
          <p>Australian: Native - C2</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col pt-16 px-32 bg-digitalent-blue text-white justify-end h-[34vh] 3xl:h-[20vh]">
          <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16">
            <div className="text-digitalent-green">
              <h1>{dict.candidate.candidate}:</h1>
              <h1>{dict.candidate.vacancy}:</h1>
            </div>
            <div>
              <h1>Christoph Kowalski</h1>
              <h1>Senior Consultant (CIO Advisory) </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-16 px-32">
          <div className="max-w-[48rem]">
            <h2 className="text-xl font-title mb-8 ">
              {dict.candidate.professionalDetails}
            </h2>
            <p>{dict.candidate.desiredSalary}: 130 000 CHF</p>
            <p>{dict.candidate.targetSalary}: 90 000 - 140 CHF</p>
            <p>{dict.candidate.noticePeriod}: 1 month</p>
            <p>{dict.candidate.commuteDistanceToWork}: 3 km</p>
            <p>{dict.candidate.currentPosition}: Frontend Engineer @NASA</p>
            <h2 className="text-xl font-title my-8">
              {dict.candidate.relevantExperience}
            </h2>
            <p>
              Christoph Pfister ist seit vielen Jahren in verschiedenen Rollen
              im BereichInformationstechnik unterwegs und würde sein Wissen und
              seine Erfahrungsehr gerne als Berater einbringen. Es reizt ihn
              spannende sowie komplexeProblemstellungen zu lösen und er kann
              dank seiner Erfahrung eine holistischeBetrachtung auf Challenges
              einnehmen. In seiner aktuellen Rolle als CIO derPEAX AG
              verantwortet er die Produktentwicklung und den Betrieb
              einerSaaS-Plattform für digitale Services. In seiner zusätzlichen
              Gruppen-Rolle durfteer in der Base-Net Unternehmensgruppe
              verschiedene grosse Projekteerfolgreich umsetzen. Er ist sich
              gewohnt mit einer 360 Grad Sicht zu agierenund dazu die
              verschiedenen Sachverhalte und Themen für unterschiedlicheZiel-
              und Anspruchsgruppen verständlich und nachvollziehbar
              aufzubereitenund zu präsentieren. Als Mitglied des Enterprise
              Architektur Boards ist er zudemverantwortlich für die
              Identifikation sowie Einführung von neuen Technologienund für
              regulatorische und IT-rechtliche Themen.
            </p>
            <h2 className="text-xl font-title my-8">
              {dict.candidate.reasonForChange}
            </h2>
            <p>
              Die basenet Informatik (grösster Teil der Gruppe) wurde verkauft
              und vielekleinere Gesellschaften konsolidiert. Er begleitet diese
              “Carve-outs” derGesellschaften, danach ist seine Rolle obsolet
              bzw. nicht mehr so spannend. Erhat deshalb entschieden ausserhalb
              der Gruppe eine neue Herausforderung zusuchen. Das
              Dienstleistungsportfolio von atrete tönt sehr spannend und mit
              den. Werten von atrete kann er sich sehr gut identifizieren
            </p>
          </div>
        </div>
        <h1 id="cvAndCertificates" className="h-[100vh] bg-digitalent-yellow">
          Cv
        </h1>
      </div>
      <div className="flex fixed bottom-6 justify-center gap-6 w-full">
        <InviteSection />
        <Button
          name="Reject"
          className="w-1/3 xl:w-1/4 max-w-[32rem] text-white bg-digitalent-blue"
        >
          {dict.mainButtons.notInterested}
        </Button>
        <Button
          name="Pdf"
          className="w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light"
        >
          {dict.mainButtons.downloadAsPDF}
        </Button>
      </div>
    </div>
  );
}
