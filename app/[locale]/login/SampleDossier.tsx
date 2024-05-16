import React from "react";
import SampleAvatar from "@/public/sampleAvatar.webp";
import Image from "next/image";

const SampleDossier = () => {
  return (
    <div className="w-full sm:pt-16 xl:grid xl:grid-cols-[minmax(450px,1fr),2fr] 2xl:grid-cols-[minmax(250px,1fr),2fr]">
      <div className="flex flex-col bg-digitalent-blue text-white sm:items-start xl:items-end md:px-8 lg:px-16 xl:px-0">
        <div className="flex flex-col justify-end items-center md:items-start xl:h-[34vh] 3xl:h-[30vh] pt-16 md:px-16 2xl:px-32 md:w-[27rem] 2xl:w-[35rem] w-full">
          <Image
            src={SampleAvatar}
            alt="Sample Avatar"
            className="rounded-full sm:w-52 sm:h-52 h-40 w-40 blur-lg"
          />
        </div>
        <div className="flex flex-col mt-20 xl:mt-8 sm:px-16 2xl:px-32 px-8 mb-12 blur-sm min-h-[70vh]">
          <div className="flex flex-col md:hidden font-title text-2xl gap-12 mb-16">
            <div>
              <h1>John Doe</h1>
              <h1 className="text-base mt-4 text-digitalent-green">
                {" " + "Candidates For"}:
              </h1>
              <h1 className="text-xl">Software Engineer</h1>
            </div>
          </div>
          <div className="hidden md:flex xl:hidden flex-col md blur-sm">
            <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16">
              <div className="text-digitalent-green">
                <h1>Candidate:</h1>
                <h1>Vacancy:</h1>
              </div>
              <div>
                <h1>John Doe</h1>
                <h1>Software Engineer</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col leading-7 lg:flex-row xl:flex-col lg:gap-16 xl:gap-8 sm:gap-8 sm:mt-8 justify-between xl:w-[19rem] blur-sm">
            <div className="md:w-1/2 xl:w-full">
              <h2 className="text-xl font-title mb-4 sm:mb-8">
                Contact Details
              </h2>
              <p>1234567890</p>
              <div className="flex gap-2">
                <p className="overflow-hidden text-ellipsis">
                  johndoe@example.com
                </p>
              </div>
            </div>
            <div className="md:w-1/2 xl:w-full">
              <h2 className="text-xl font-title mb-4 mt-8 sm:mt-0 sm:mb-8 whitespace-nowrap">
                Personal Details
              </h2>
              <p className="whitespace-nowrap">01-01-1990 (31)</p>
              <p className="overflow-hidden text-ellipsis">123 Street</p>
              <p className="overflow-hidden text-ellipsis">City 12345</p>
              <p>Country</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="hidden xl:flex flex-col pt-16 sm:px-16 2xl:px-32 bg-digitalent-blue text-white justify-end min-h-[34vh] 3xl:h-[30vh]">
          <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16 blur-md">
            <div className="text-digitalent-green">
              <h1>Candidate:</h1>
              <h1>Vacancy:</h1>
            </div>
            <div>
              <h1>John Doe</h1>
              <h1>Software Engineer</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-12 sm:my-16 sm:px-16 md:px-24 lg:px-32 px-8">
          <div className="max-w-[48rem] blur-sm">
            <h2 className="text-xl font-title mb-4 sm:mb-8 ">
              Professional Details
            </h2>
            <div className="block sm:hidden">
              <p>
                Current Position: <b>Software Engineer</b>
              </p>
              <p>
                Notice Period: <b>3 months</b>
              </p>
              <p>
                Desired Salary: <b>CHF 100'000</b>
              </p>
              <p>
                Desired Workload: <b>80%</b>
              </p>
            </div>
            <div className="hidden sm:grid grid-cols-[300px,1fr]">
              <div>
                <p>Current Position:</p>
                <p>Notice Period:</p>
                <p>Desired Salary:</p>
                <p>Desired Workload:</p>
              </div>
              <div>
                <p>Software Engineer</p>
                <p>3 months</p>
                <p>CHF 100'000</p>
                <p>80%</p>
              </div>
            </div>
            <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
              Interview Summary
            </h2>
            <p>
              In the interview for the position of Head of Customer Relations,
              the candidate demonstrated a comprehensive understanding of
              customer relationship management (CRM) principles, stemming from
              his Master of Advanced Studies (MAS) in CRM from ZHAW Zürcher
              Hochschule für Angewandte Wissenschaften, Winterthur. He
              articulated his expertise in developing and implementing effective
              CRM strategies to enhance customer satisfaction and loyalty.
              Drawing from his academic background and practical experience, he
              highlighted his proficiency in leveraging data analytics and
              segmentation techniques to personalize customer interactions and
              drive business growth. Moreover, the candidate emphasized his
              ability to lead cross-functional teams and collaborate with
              stakeholders to align CRM initiatives with organizational
              objectives. His passion for delivering exceptional customer
              experiences and his innovative approach to problem-solving were
              evident throughout the discussion.
            </p>
            <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
              Reason for Change
            </h2>
            <ul>
              <li>Seeking better work-life balance.</li>
              <li>Desire for career advancement opportunities.</li>
              <li>Wanting to work in a different industry or field.</li>
              <li>Relocation to a new city or country.</li>
            </ul>
            <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
              Education Summary
            </h2>
            <div>
              He completed a Master of Advanced Studies (MAS) in Customer
              Relationship Management (CRM) at ZHAW Zürcher Hochschule für
              Angewandte Wissenschaften, Winterthur. This specialized program
              equipped him with advanced knowledge and practical skills in
              effectively managing customer relationships within diverse
              industries. During his studies, he delved into topics such as CRM
              strategies, customer segmentation, data analytics, and customer
              experience optimization. Through hands-on projects and case
              studies, he gained valuable insights into the latest CRM
              technologies and methodologies, preparing him to address complex
              challenges in the field. Additionally, he had the opportunity to
              collaborate with industry professionals and experts, further
              enriching his learning experience and expanding his professional
              network. His academic journey not only deepened his understanding
              of CRM principles but also honed his critical thinking,
              problem-solving, and leadership abilities. Now equipped with a
              solid foundation in CRM best practices and a Master's degree from
              a renowned institution, he is poised to make meaningful
              contributions in driving customer-centric strategies and enhancing
              business outcomes in his future endeavors.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDossier;
