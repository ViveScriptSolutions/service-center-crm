// lib/types/formStates.ts
export type ProfileFormState = {
  message?: string | null;
  error?: string | null;
  success?: string | null;
  details?: {
    image?: string[] | undefined;
    name?: string[] | undefined;
  } | null;
};

// You can add other form state types here as your application grows
