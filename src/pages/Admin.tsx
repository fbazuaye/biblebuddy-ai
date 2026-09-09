import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Users, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";

interface Member {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (adminLoading) return;
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }

    const load = async () => {
      const { data, error } = await supabase.rpc("admin_list_users");
      if (error) {
        setError("Not authorised to view members.");
      } else {
        setMembers((data as Member[]) ?? []);
      }
      setLoading(false);
    };

    load();
  }, [isAdmin, adminLoading, navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.first_name, m.last_name, m.email].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [members, query]);

  if (adminLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO title="Members | ScriptureChat" description="Private admin view of ScriptureChat members." canonicalUrl="/admin" />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">ScriptureChat</h1>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8 pt-24">
        {error ? (
          <div className="glass-card p-6 text-destructive">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-muted p-3 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{members.length}</p>
                  <p className="text-sm text-muted-foreground">Total members</p>
                </div>
              </div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email"
                className="sm:max-w-xs"
              />
            </div>

            <div className="glass-card overflow-x-auto p-2">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground">
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Joined</th>
                    <th className="p-3 font-medium">Last sign-in</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} className="border-b border-border/20 last:border-0">
                      <td className="p-3 text-foreground">
                        {[m.first_name, m.last_name].filter(Boolean).join(" ") || "—"}
                      </td>
                      <td className="p-3 text-muted-foreground">{m.email || "—"}</td>
                      <td className="p-3 text-muted-foreground">{formatDate(m.created_at)}</td>
                      <td className="p-3 text-muted-foreground">{formatDate(m.last_sign_in_at)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        No members match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
