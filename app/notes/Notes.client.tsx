"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import css from "./NotesPage.module.css";

import noteService from "@/lib/api";
import { NOTES_PER_PAGE } from "@/lib/notesConstants";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

const NotesClient = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      noteService.fetchNotes({ page, perPage: NOTES_PER_PAGE, search }),
    placeholderData: keepPreviousData,
  });

  const pageCount = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
        <SearchBox onChange={debouncedSetSearch} />
      </header>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading notes</div>}
      {Array.isArray(data?.notes) && data.notes.length > 0 && (
        <>
          {pageCount > 1 && (
            <Pagination
              totalPages={pageCount}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
          <NoteList notes={data.notes} />
        </>
      )}
    </div>
  );
};

export default NotesClient;
