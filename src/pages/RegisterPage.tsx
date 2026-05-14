import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "../components/Logo";
import { createInitialProfile } from "../lib/api";
import { supabase } from "../lib/supabase";
import { authSchema } from "../lib/validators";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid registration");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp(parsed.data);
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      try {
        await createInitialProfile(data.user.id, data.user.email || parsed.data.email);
      } catch {
        // Email confirmation flows may delay RLS visibility; the dashboard will create it on first login.
      }
    }
    setLoading(false);
    toast.success("Account created");
    navigate("/dashboard");
  };

  return (
    <div className="luxury-page grid place-items-center px-4 py-8">
      <form onSubmit={submit} className="glass-panel w-full max-w-md rounded-[2rem] p-6">
        <Logo to="/" className="mb-8" />
        <h1 className="heading text-3xl">Create your page</h1>
        <p className="mt-2 text-sm text-luxury-muted">Your initial profile row is created right after signup.</p>
        <div className="mt-6 space-y-4">
          <label><span className="label">Email</span><input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span className="label">Password</span><input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="btn-primary w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} Register</button>
        </div>
        <p className="mt-5 text-center text-sm text-luxury-muted">Already registered? <Link className="text-luxury-accent hover:text-luxury-accentHover" to="/login">Login</Link></p>
      </form>
    </div>
  );
};
