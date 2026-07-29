import { useState } from "react";

import TranscriptInput from "../components/TranscriptInput";
import SummaryCard from "../components/SummaryCard";
import DecisionsCard from "../components/DecisionsCard";
import ActionsCard from "../components/ActionsCard";
import TasksTable from "../components/TasksTable";
import ExportButtons from "../components/ExportButtons";
import CopyButton from "../components/CopyButton";
import ThemeToggle from "../components/ThemeToggle";

import {
  summarizeTranscript,
  type MeetingNotes,
} from "../services/api";

import { useAuth } from "../context/AuthContext";


export default function HomePage() {
  const {
    user,
    logout,
  } = useAuth();


  const [notes, setNotes] =
    useState<MeetingNotes | null>(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  async function handleSummarize(
    transcript: string
  ) {
    setLoading(true);
    setError("");

    try {
      const result =
        await summarizeTranscript(
          transcript
        );

      setNotes(result);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to generate meeting notes."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main
      className="
        min-h-screen
        bg-gray-100
        text-gray-900
        dark:bg-gray-900
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
          p-8
        "
      >

        <header
          className="
            mb-8
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <h1
              className="
                text-4xl
                font-bold
              "
            >
              AI Meeting Notes Generator
            </h1>

            <p
              className="
                mt-2
                text-gray-600
                dark:text-gray-300
              "
            >
              Welcome
              {user
                ? `, ${user.email}`
                : ""}
            </p>
          </div>


          <div
            className="
              flex
              gap-3
            "
          >
            <ThemeToggle />

            <button
              type="button"
              onClick={logout}
              className="
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-white
                hover:bg-red-700
              "
            >
              Logout
            </button>
          </div>

        </header>


        <TranscriptInput
          loading={loading}
          error={error}
          onGenerate={handleSummarize}
        />


        {loading && (
          <div
            className="
              mt-8
              rounded-xl
              bg-white
              p-6
              text-center
              shadow
              dark:bg-gray-800
            "
          >
            Generating meeting notes...
          </div>
        )}


        {notes && (
          <div
            className="
              mt-8
              space-y-6
            "
          >

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              <ExportButtons
                notes={notes}
              />

              <CopyButton
                notes={notes}
              />
            </div>


            <SummaryCard
              summary={notes.summary}
            />


            <DecisionsCard
              decisions={notes.decisions}
            />


            <ActionsCard
              actionItems={
                notes.actionItems
              }
            />


            <TasksTable
              tasks={notes.tasks}
            />

          </div>
        )}

      </div>
    </main>
  );
}
