import { Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { authSchema } from "../lib/validators";
import { siteUrl } from "../lib/constants";
import { Logo } from "../components/Logo";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid login");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) toast.error(error.message);
    else navigate("/dashboard");
  };

  const magicLink = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${siteUrl}/dashboard` } });
    if (error) toast.error(error.message);
    else toast.success("Magic link sent");
  };

  return (
    <div className="luxury-page grid place-items-center px-4 py-8">
      <form onSubmit={submit} className="glass-panel w-full max-w-md rounded-[2rem] p-6">
        <Logo to="/" className="mb-8" />
        <h1 className="heading text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-luxury-muted">Sign in to manage your Abo7mod profile.</p>
        <div className="mt-6 space-y-4">
          <label><span className="label">Email</span><input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span className="label">Password</span><input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="btn-primary w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} Login</button>
          <button type="button" className="btn-secondary w-full" onClick={magicLink}><Mail className="h-4 w-4" /> Send magic link</button>
        </div>
        <p className="mt-5 text-center text-sm text-luxury-muted">No account? <Link className="text-luxury-accent hover:text-luxury-accentHover" to="/register">Create one</Link></p>
      </form>
    </div>
  );
};
