import { AuditResult } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

export const auditWebsite = async (url: string): Promise<AuditResult> => {
  const response = await fetch(`${API_BASE_URL}/api/audit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Audit failed');
  }

  return response.json() as Promise<AuditResult>;
};
