import { apiRequest } from "@/lib/api/client";

export interface ContactPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export function submitContactApi(payload: ContactPayload) {
  return apiRequest<{ contact: ContactPayload & { id: string; createdAt: string } }>(
    "/contact",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
