"use client";
import { Candidate } from "@/utils";
import ToDoList from "@/public/toDoList.png";
import Image from "next/image";

export default function DossierStatus({ candidate }: { candidate: Candidate }) {
  if (!candidate.dossierMessage?.length) return;

  return (
    <div className="pt-4 sm:pt-20  bg-digitalent-blue">
      <div
        className={`py-4 px-8 sm:px-16 md:px-24 lg:px-32 bg-digitalent-green flex gap-6 items-center text-white`}
      >
        <Image
          src={ToDoList}
          alt="To Do List Icon"
          className="hidden md:block max-h-12 max-w-12"
        />
        <div className="font-title">{candidate.dossierMessage}</div>
      </div>
    </div>
  );
}
