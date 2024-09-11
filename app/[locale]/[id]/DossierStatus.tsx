"use client";
import { Candidate } from "@/utils";
import ToDoList from "@/public/toDoList.png";
import Image from "next/image";

export default function DossierStatus({ candidate }: { candidate: Candidate }) {
  if (!candidate.dossierMessage?.length) return;

  return (
    <div className={`p-8 mb-8 bg-digitalent-green flex gap-6 items-center`}>
      <Image
        src={ToDoList}
        alt="To Do List Icon"
        className="hidden md:block max-h-16 max-w-16"
      />
      <div className="font-title">{candidate.dossierMessage}</div>
    </div>
  );
}
