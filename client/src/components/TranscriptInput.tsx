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
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setLocalError("");
    setSelectedFile(file.name);

    try {
      const extractedText =
        await uploadTranscript(file);

      setTranscript(extractedText);
    } catch (error) {
      setLocalError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await upload(file);

    event.target.value = "";
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  async function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    const file = event.dataTransfer.files[0];

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
        "Please enter or upload a meeting transcript."
      );
      return;
    }

    onGenerate(transcript);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-lg border bg-white p-3 text-black dark:border-gray-600 dark:bg-gray-900 dark:text-white"
    >
      <h1 className="mb-2 text-3xl font-bold">
        AI Meeting Notes Generator
      </h1>

      <p className="mb-6 text-gray-600">
        Paste a meeting transcript or upload a
        supported file.
      </p>

      <label
        htmlFor="transcript"
        className="mb-2 block font-medium"
      >
        Meeting Transcript
      </label>

      <textarea
        id="transcript"
        rows={14}
        value={transcript}
        onChange={(event) => {
          setTranscript(event.target.value);
          setLocalError("");
        }}
        placeholder="Paste meeting transcript..."
        className="mb-6 w-full rounded-lg border p-3"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-6 rounded-lg border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300"
        }`}
      >
        <p className="mb-4 text-lg font-medium">
          Drag & Drop a transcript here
        </p>

        <p className="mb-4 text-sm text-gray-500">
          or
        </p>

        <input
          id="upload"
          type="file"
          accept=".txt,.docx,.pdf"
          onChange={handleFileUpload}
          disabled={loading || uploading}
          className="mx-auto block"
        />

        <p className="mt-4 text-sm text-gray-500">
          Supported formats:
          .txt, .docx, .pdf
        </p>
      </div>

      {selectedFile && (
        <div className="mb-4 rounded bg-gray-100 p-3">
          <strong>Selected:</strong>{" "}
          {selectedFile}
        </div>
      )}

      {localError && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {localError}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          loading ||
          uploading ||
          !transcript.trim()
        }
        className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading
          ? "Uploading..."
          : loading
          ? "Generating..."
          : "Generate Meeting Notes"}
      </button>
    </form>
  );
}
