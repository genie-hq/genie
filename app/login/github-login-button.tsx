"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function GithubLoginButton() {
  const login = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  return (
    <Button type="button" onClick={login}>
      Login with GitHub
    </Button>
  );
}
