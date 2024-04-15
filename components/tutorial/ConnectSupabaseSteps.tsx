import Step from "./Step";

export default function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <Step title="Declare environment variables">
        <p>
          Duplicate the{" "}
          <span className="px-2 py-1 rounded-md bg-foreground/20 text-foreground/80">
            .env.example
          </span>{" "}
          file in your Next.js app and rename it to{" "}
          <span className="px-2 py-1 rounded-md bg-foreground/20 text-foreground/80">
            .env.local
          </span>{" "}
          , then fill in{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="font-bold hover:underline text-foreground/80"
            rel="noreferrer"
          >
            your local Supabase project URL and API key
          </a>
          .
        </p>
      </Step>
    </ol>
  );
}
