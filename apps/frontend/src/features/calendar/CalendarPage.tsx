import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSelectedDate } from "./calendarSlice";
import { useNotesByDate, useCreateNote } from "../notes/notesApi";

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector((state) => state.calendar.selectedDate);

  const { data: notes, isLoading } = useNotesByDate(selectedDate);
  const createNote = useCreateNote();

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Calendar Notes</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          {/* LEFT: Calendar */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Pick a day</h2>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const day = String(i + 1).padStart(2, "0");
                const date = `2026-04-${day}`;

                return (
                  <button
                    key={date}
                    onClick={() => dispatch(setSelectedDate(date))}
                    className="rounded-xl border p-3 text-sm hover:bg-gray-100"
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Notes + Create */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              {selectedDate ? `Notes for ${selectedDate}` : "Select a date"}
            </h2>

            {!selectedDate && (
              <p className="text-sm text-gray-500">No date selected.</p>
            )}

            {selectedDate && isLoading && (
              <p className="text-sm text-gray-500">Loading notes...</p>
            )}

            {selectedDate && !isLoading && (
              <div className="space-y-3">
                {notes?.length ? (
                  notes.map((note) => (
                    <div key={note.id} className="rounded-xl border p-3">
                      <h3 className="font-medium">{note.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {note.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No notes for this date yet.
                  </p>
                )}
              </div>
            )}

            {/* CREATE NOTE FORM */}
            {selectedDate && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const form = e.target as HTMLFormElement;
                  const title = (
                    form.elements.namedItem("title") as HTMLInputElement
                  ).value;
                  const content = (
                    form.elements.namedItem("content") as HTMLInputElement
                  ).value;

                  createNote.mutate({
                    date: selectedDate,
                    title,
                    content,
                  });

                  form.reset();
                }}
                className="mt-6 space-y-2"
              >
                <input
                  name="title"
                  placeholder="Title"
                  className="w-full rounded border p-2"
                  required
                />
                <input
                  name="content"
                  placeholder="Content"
                  className="w-full rounded border p-2"
                />

                <button
                  type="submit"
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add Note
                </button>

                {createNote.isLoading && (
                  <p className="text-sm text-gray-500">Creating note...</p>
                )}

                {createNote.isError && (
                  <p className="text-sm text-red-500">
                    Failed to create note.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}