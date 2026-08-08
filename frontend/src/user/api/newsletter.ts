import { apiRequest } from "@/lib/api/client";

export function subscribeNewsletterApi(email: string) {
  return apiRequest<{
    alreadySubscribed: boolean;
    subscriber: { id: string; email: string; createdAt: string };
  }>("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
