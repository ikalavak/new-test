import { useQuery } from "@tanstack/react-query";

interface KeyData {
  keyId: string;
  keySpec: string;
  created: string;
  risk: "RED" | "YELLOW" | "GREEN";
}

export const useKMSKeys = () => {
  return useQuery<KeyData[]>({
    queryKey: ["kms-keys"],
    queryFn: async () => {
      const res = await fetch(import.meta.env.VITE_API_URL + "/keys");
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected array of keys");
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
