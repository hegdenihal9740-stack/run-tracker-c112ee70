import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/features/hr/data";

export const Route = createFileRoute("/reset-password")({
  head: () => pageHead("Reset Password", "Choose a new password for your HR Management account."),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return void toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/" });
  }
  return (
    <form className="hr-panel" onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Set a new password</h2>
      <div className="hr-field"><label htmlFor="np">New password</label>
        <input id="np" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <div className="hr-actions"><Button type="submit">Update Password</Button></div>
    </form>
  );
}
