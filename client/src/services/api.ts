import axios from "axios";

export interface MeetingTask {
  person: string | null;
  task: string;
  dueDate: string | null;
}

export interface MeetingNotes {
  summary: string;
  decisions: string[];
  actionItems: string[];
  tasks: MeetingTask[];
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

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

export async function summarizeTranscript(
  transcript: string
): Promise<MeetingNotes> {
  const response = await api.post<{
    notes: MeetingNotes;
  }>("/summarize", {
    transcript,
  });

  return response.data.notes;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ??
      error.message ??
      "Request failed."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export default api;
