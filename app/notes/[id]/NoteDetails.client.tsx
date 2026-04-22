"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import css from "./NoteDetails.module.css";
import noteService from "@/lib/api";

type NoteDetailsClientProps = {
  id: string;
};

const NoteDetailsClient = ({ id }: NoteDetailsClientProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => noteService.fetchNoteById({ id }),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) {
    return (
      <p role="alert">
        {error instanceof Error ? error.message : "Something went wrong."}
      </p>
    );
  }
  if (!data) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data?.title}</h2>
        </div>
        <p className={css.tag}>{data?.tag}</p>
        <p className={css.content}>{data?.content}</p>
        <p className={css.date}>{data?.createdAt}</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
