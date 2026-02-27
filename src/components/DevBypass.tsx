import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

const roles: { role: UserRole; emoji: string; label: string; path: string }[] = [
  { role: 'teacher', emoji: '👨‍🏫', label: 'Teacher', path: '/teacher' },
  { role: 'student', emoji: '👨‍🎓', label: 'Student', path: '/student' },
  { role: 'parent', emoji: '👨‍👩‍👧', label: 'Parent', path: '/parent' },
];

export default function DevBypass() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (role: typeof roles[number]) => {
    // Store dev bypass in sessionStorage so it persists across navigations but not tabs
    sessionStorage.setItem('dev_bypass', JSON.stringify({
      id: 'dev-user-id',
      name: 'Developer',
      email: 'dev@localhost',
      role: role.role,
      school: 'Dev School',
    }));
    setOpen(false);
    // Force full reload so AuthContext picks up the bypass
    window.location.href = role.path;
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
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground"
            >
              <span>{r.emoji}</span> {r.label} Dashboard
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
