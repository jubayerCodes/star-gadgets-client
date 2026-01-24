import { isAxiosError } from "axios";

export const extractErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    const responseData = err.response?.data;

    const baseMessage = responseData?.message || responseData?.error || err.message || "An unknown error occurred";

    const details = responseData?.errorDetails;
    if (Array.isArray(details)) {
      const fieldMessages = details
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((detail: any) => {
          const field = detail?.field;
          const message = detail?.message;
          return field && message ? `${field}: ${message}` : null;
        })
        .filter(Boolean)
        .join(" | ");

      return fieldMessages ? `${baseMessage} (${fieldMessages})` : baseMessage;
    }

    return baseMessage;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Something went wrong";
};
