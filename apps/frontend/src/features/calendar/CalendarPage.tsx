import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCurrentMonth, setSelectedDate } from "./calendarSlice";
import {
  useCreateNote,
  useDeleteNote,
  useNotesByDate,
  useNotesByMonth,
  useUpdateNote,
  type Note,
} from "../notes/notesApi";

function getMonthLabel(monthString: string) {
  const [year, month] = monthString.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function getDaysInMonth(monthString: string) {
  const [year, month] = monthString.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay();

  const cells: Array<{ date: string | null; dayNumber: number | null }> = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ date: null, dayNumber: null });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayString = String(day).padStart(2, "0");
    cells.push({
      date: `${monthString}-${dayString}`,
      dayNumber: day,
    });
  }

  return cells;
}

function getPreviousMonth(monthString: string) {
  const [year, month] = monthString.split("-").map(Number);
  const date = new Date(year, month - 2, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getNextMonth(monthString: string) {
  const [year, month] = monthString.split("-").map(Number);
  const date = new Date(year, month, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getMonthMap(notes: Note[] | undefined) {
  const map = new Map<string, number>();

  if (!notes) return map;

  for (const note of notes) {
    map.set(note.date, (map.get(note.date) ?? 0) + 1);
  }

  return map;
}

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector((state) => state.calendar.selectedDate);
  const currentMonth = useAppSelector((state) => state.calendar.currentMonth);

  const { data: notes, isLoading } = useNotesByDate(selectedDate);
  const { data: monthNotes } = useNotesByMonth(currentMonth);

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const monthCells = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
  const noteCountByDate = useMemo(() => getMonthMap(monthNotes), [monthNotes]);

  const selectedDayNotes = notes ?? [];

  function startEdit(note: Note) {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function cancelEdit() {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Calendar App
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Calendar Notes
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Keep simple notes on each day, switch months, and manage everything
            from one clean dashboard.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          {/* LEFT PANEL */}
          <div className="rounded-[32px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() =>
                  dispatch(setCurrentMonth(getPreviousMonth(currentMonth)))
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-50"
              >
                ← Prev
              </button>

              <div className="text-center">
                <h2 className="text-4xl font-bold text-slate-900">
                  {getMonthLabel(currentMonth)}
                </h2>
                <p className="mt-1 text-lg text-slate-500">
                  Select a day to view or add notes
                </p>
              </div>

              <button
                onClick={() => dispatch(setCurrentMonth(getNextMonth(currentMonth)))}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Next →
              </button>
            </div>

            <div className="mb-4 grid grid-cols-7 gap-3 text-center text-lg font-semibold uppercase tracking-wide text-slate-400">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {monthCells.map((cell, index) => {
                if (!cell.date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="h-32 rounded-[24px] bg-slate-50"
                    />
                  );
                }

                const isSelected = selectedDate === cell.date;
                const noteCount = noteCountByDate.get(cell.date) ?? 0;

                return (
                  <button
                    key={cell.date}
                    onClick={() => dispatch(setSelectedDate(cell.date))}
                    className={[
                      "flex h-32 flex-col justify-between rounded-[24px] border p-4 text-left transition",
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-4xl font-semibold leading-none",
                        isSelected ? "text-blue-700" : "text-slate-900",
                      ].join(" ")}
                    >
                      {cell.dayNumber}
                    </span>

                    {noteCount > 0 ? (
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        <span>
                          {noteCount} note{noteCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-300">No notes</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex h-[820px] min-h-0 flex-col overflow-hidden rounded-[32px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="shrink-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Notes Panel
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                {selectedDate ?? "Select a date"}
              </h2>
              <p className="mt-2 text-lg text-slate-500">
                {selectedDate
                  ? "View, edit, delete, or add notes for this day."
                  : "Choose a date on the calendar to get started."}
              </p>
            </div>

            {!selectedDate && (
              <div className="mt-6 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-base text-slate-500">
                No date selected yet.
              </div>
            )}

            {selectedDate && (
              <>
                <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
                  {isLoading ? (
                    <div className="rounded-[24px] bg-slate-50 p-5 text-base text-slate-500">
                      Loading notes...
                    </div>
                  ) : selectedDayNotes.length ? (
                    <div className="space-y-4">
                      {selectedDayNotes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm"
                        >
                          {editingNoteId === note.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();

                                updateNote.mutate({
                                  id: note.id,
                                  date: selectedDate,
                                  title: editTitle,
                                  content: editContent,
                                });

                                cancelEdit();
                              }}
                              className="space-y-3"
                            >
                              <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-lg text-slate-900 outline-none focus:border-blue-400"
                                required
                              />
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-base text-slate-700 outline-none focus:border-blue-400"
                                rows={4}
                              />
                              <div className="flex gap-3">
                                <button
                                  type="submit"
                                  className="rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {note.title}
                              </h3>
                              <p className="mt-3 whitespace-pre-wrap text-lg leading-8 text-slate-700">
                                {note.content || "No content."}
                              </p>

                              <div className="mt-5 flex gap-3">
                                <button
                                  onClick={() => startEdit(note)}
                                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    deleteNote.mutate({
                                      id: note.id,
                                      date: note.date,
                                    })
                                  }
                                  className="rounded-2xl bg-rose-500 px-5 py-3 text-base font-semibold text-white hover:bg-rose-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-base text-slate-500">
                      No notes for this date yet.
                    </div>
                  )}
                </div>

                <div className="mt-6 shrink-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-3xl font-bold text-slate-900">Add Note</h3>
                  <p className="mt-2 text-lg text-slate-500">
                    Add a quick note for the selected day.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      const form = e.target as HTMLFormElement;
                      const title = (
                        form.elements.namedItem("title") as HTMLInputElement
                      ).value;
                      const content = (
                        form.elements.namedItem("content") as HTMLTextAreaElement
                      ).value;

                      createNote.mutate({
                        date: selectedDate,
                        title,
                        content,
                      });

                      form.reset();
                    }}
                    className="mt-5 space-y-4"
                  >
                    <input
                      name="title"
                      placeholder="Title"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-lg text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
                      required
                    />

                    <textarea
                      name="content"
                      placeholder="Write your note here..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-base text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
                      rows={5}
                    />

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-lg font-semibold text-white hover:bg-slate-800"
                    >
                      Add Note
                    </button>

                    {createNote.isPending && (
                      <p className="text-sm text-slate-500">Creating note...</p>
                    )}

                    {createNote.isError && (
                      <p className="text-sm text-rose-500">
                        Failed to create note.
                      </p>
                    )}
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}