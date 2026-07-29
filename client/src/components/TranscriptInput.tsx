import { useState } from "react";

import {
  uploadTranscript,
  getErrorMessage,
} from "../services/api";

interface TranscriptInputProps {
  loading: boolean;
  error: string;
  onGenerate: (transcript: string) => void;
}

export default function TranscriptInput({
  loading,
  error,
  onGenerate,
}: TranscriptInputProps) {
  const [transcript, setTranscript] = useState("");

  const [uploading, setUploading] =
    useState(false);

  const [localError, setLocalError] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState("");

  const [dragging, setDragging] =
    useState(false);


  async function upload(file: File) {
    setUploading(true);
    setLocalError("");
    setSelectedFile(file.name);

    try {
      const text =
        await uploadTranscript(file);

      setTranscript(text);
    } catch (error) {
      setLocalError(
        getErrorMessage(error)
      );
    } finally {
      setUploading(false);
    }
  }


  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    await upload(file);

    event.target.value = "";
  }


  async function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer.files[0];

    if (!file) {
      return;
    }

    await upload(file);
  }


  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLocalError("");

    if (!transcript.trim()) {
      setLocalError(
        "Please enter a transcript."
      );

      return;
    }

    onGenerate(transcript);
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-xl
        bg-white
        p-6
        shadow
        dark:bg-gray-800
      "
    >
      <h2 className="mb-4 text-2xl font-bold">
        Meeting Transcript
      </h2>


      <textarea
        value={transcript}
        onChange={(event) => {
          setTranscript(
            event.target.value
          );

          setLocalError("");
        }}
        rows={12}
        placeholder="Paste your meeting transcript..."
        className="
          mb-4
          w-full
          rounded-lg
          border
          p-4
          text-black
          dark:text-white
        "
      />


      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() =>
          setDragging(false)
        }
        onDrop={handleDrop}
        className={`
          mb-4
          rounded-lg
          border-2
          border-dashed
          p-6
          text-center
          ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }
        `}
      >
        <p className="mb-3">
          Drag & drop transcript file
        </p>

        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
          disabled={
            loading || uploading
          }
        />

        {selectedFile && (
          <p className="mt-3 text-sm">
            Selected: {selectedFile}
          </p>
        )}
      </div>


      {(localError || error) && (
        <div
          className="
            mb-4
            rounded
            bg-red-100
            p-3
            text-red-700
          "
        >
          {localError || error}
        </div>
      )}


      <button
        type="submit"
        disabled={
          loading ||
          uploading ||
          !transcript.trim()
        }
        className="
          w-full
          rounded-lg
          bg-blue-600
          py-3
          text-white
          hover:bg-blue-700
          disabled:opacity-50
        "
      >
        {uploading
          ? "Uploading..."
          : loading
          ? "Generating..."
          : "Generate Notes"}
      </button>

    </form>
  );
}
