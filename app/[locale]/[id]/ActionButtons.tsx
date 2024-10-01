import {
  Candidate,
  Dictionary,
  Locale,
  RelationshipManager,
  SearchParams,
  User,
} from "@/utils";
import InviteSection from "./InviteSection";
import RejectSection from "./RejectSection";
import ContactSection from "./ContactSection";

export default function ActionButtons({
  dict,
  user,
  params,
  searchParams,
  candidate,
  id,
  locale,
  relationshipManager,
}: {
  dict: Dictionary;
  user: User;
  params: { locale: Locale; id: string };
  searchParams?: SearchParams;
  candidate?: Candidate;
  id: string;
  locale: Locale;
  relationshipManager?: RelationshipManager;
}) {
  return (
    <div className="z-10 flex fixed md:bottom-6 bottom-0 justify-center sm:gap-3 md:gap-6 w-full">
      <InviteSection
        dict={{
          ...dict.inviteModal,
          ...dict.mainButtons,
          ...dict.toastMessages,
        }}
        user={user}
        params={params}
        candidateGender={candidate?.gender}
        searchParams={searchParams}
      />

      <RejectSection
        dict={{
          ...dict.rejectModal,
          ...dict.mainButtons,
          ...dict.toastMessages,
        }}
        id={id}
        locale={locale}
        candidateGender={candidate?.gender}
        isRejectButtonVisible={user.isRejectButtonVisible}
      />

      <ContactSection
        dict={{
          ...dict.mainButtons,
          ...dict.contactModal,
          ...dict.toastMessages,
        }}
        relationshipManager={relationshipManager}
        id={id}
      />
    </div>
  );
}
