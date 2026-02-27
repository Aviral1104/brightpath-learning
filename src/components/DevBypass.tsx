import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Loader2 } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';
import { getSupabaseClient, isBackendConfigured } from '@/integrations/backend/client';
import { toast } from 'sonner';

const roles: { role: UserRole; emoji: string; label: string; path: string }[] = [
  { role: 'teacher', emoji: '👨‍🏫', label: 'Teacher', path: '/teacher' },
  { role: 'student', emoji: '👨‍🎓', label: 'Student', path: '/student' },
  { role: 'parent', emoji: '👨‍👩‍👧', label: 'Parent', path: '/parent' },
];

const DEV_ACCOUNTS: Record<UserRole, { email: string; password: string }> = {
  teacher: { email: 'dev-teacher@bloom.local', password: 'DevPass123!' },
  student: { email: 'dev-student@bloom.local', password: 'DevPass123!' },
  parent: { email: 'dev-parent@bloom.local', password: 'DevPass123!' },
};

export default function DevBypass() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const handleSelect = async (r: typeof roles[number]) => {
    if (!isBackendConfigured) {
      toast.error('Backend not configured');
      return;
    }
    setLoading(r.role);
    try {
      const supabase = getSupabaseClient();
      const creds = DEV_ACCOUNTS[r.role];

      // Try sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword(creds);

      if (signInError) {
        // If user doesn't exist, sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email: creds.email,
          password: creds.password,
          options: {
            data: { name: `Dev ${r.label}`, role: r.role, school: 'Dev School' },
          },
        });
        if (signUpError) throw signUpError;

        // Try signing in again after signup
        const { error: retryError } = await supabase.auth.signInWithPassword(creds);
        if (retryError) {
          toast.info('Dev account created! Email confirmation may be required. Check auth settings.');
          setLoading(null);
          return;
        }
      }

      // Clear dev bypass session storage if it exists
      sessionStorage.removeItem('dev_bypass');
      toast.success(`Signed in as Dev ${r.label}`);
      setOpen(false);
      navigate(r.path);
    } catch (err: any) {
      toast.error(err.message || 'Dev login failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {open && (
        <div className="mb-2 bg-card border border-border rounded-xl shadow-elevated p-3 space-y-2 animate-fade-in">
          <p className="text-xs font-semibold text-muted-foreground px-1">Dev Access</p>
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleSelect(r)}
              disabled={loading !== null}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground disabled:opacity-50"
            >
              {loading === r.role ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{r.emoji}</span>}
              {r.label} Dashboard
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-muted border border-border shadow-soft flex items-center justify-center hover:bg-accent transition-colors"
        title="Developer Bypass"
      >
        <Code2 className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
