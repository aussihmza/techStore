import { apiRequest } from "@/lib/api/client";

export type ReturnType = "return" | "warranty";

export interface ReturnRequest {
  id: string;
  rmaId: string;
  orderId: string;
  type: ReturnType;
  reason: string;
  details: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReturnPayload {
  orderId: string;
  type: ReturnType;
  reason: string;
  details: string;
}

export function createReturnRequestApi(payload: CreateReturnPayload) {
  return apiRequest<{ request: ReturnRequest }>("/returns", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyReturnRequestsApi() {
  return apiRequest<{ requests: ReturnRequest[]; count: number }>("/returns");
}
