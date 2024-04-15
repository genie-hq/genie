"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function GithubLoginButton() {
  const login = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      alert("Error signing in with GitHub");
      return;
    }

    console.log(data);
  };

  return (
    <Button type="button" onClick={login}>
      Login with GitHub
    </Button>
  );
}
