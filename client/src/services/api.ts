import axios from "axios";

export interface Task {
  person: string | null;
  task: string;
  dueDate: string | null;
}

export interface MeetingNotes {
  summary: string;
  decisions: string[];
  actionItems: string[];
  tasks: Task[];
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "http://localhost:3001/api",
  timeout: 60000,
});

export async function summarizeTranscript(
  transcript: string
): Promise<MeetingNotes> {
  const response = await api.post<MeetingNotes>(
    "/summarize",
    {
      transcript,
    }
  );

  return response.data;
}

export async function uploadTranscript(
  file: File
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<{
    transcript: string;
  }>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.transcript;
}

export function getErrorMessage(
  error: unknown
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: string }
      | undefined;

    if (typeof data?.error === "string") {
      return data.error;
    }

    switch (error.response?.status) {
      case 400:
        return "Invalid request.";

      case 413:
        return "The uploaded file is too large.";

      case 415:
        return "Unsupported file type.";

      case 500:
        return "The server failed to process your request.";

      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default api;
