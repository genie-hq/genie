'use client';

import { Button } from '@/components/ui/button';

export default function BotInstall() {
  const redirectToInstallationURL = async () => {
    const res = await fetch('/api/github/workflows', {
      method: 'POST',
      body: JSON.stringify({
        "username": "lluciiiia",
        "repo": "genie-testing",
        "branch": "main-with-tests-2024-04-22-02-23-05"
    }),
    });
  };

  return (
    <div className="h-full flex flex-col w-full px-2 md:px-8 items-center justify-center gap-2">
      <div className="max-w-sm">
        <h4 className="text-center text-3xl font-bold mb-1">
          Bot Installation Redirection
        </h4>
        <Button type="button" onClick={redirectToInstallationURL}>
          Test Parsing
        </Button>
      </div>
    </div>
  );
}
