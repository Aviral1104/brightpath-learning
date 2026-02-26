import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BookOpen, ClipboardList, MessageSquare, LayoutDashboard, LogOut, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = {
  teacher: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
    { label: 'Courses', icon: BookOpen, path: '/teacher/courses' },
    { label: 'Assignments', icon: ClipboardList, path: '/teacher/assignments' },
    { label: 'Feedback', icon: MessageSquare, path: '/teacher/feedback' },
  ],
  student: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student' },
    { label: 'My Courses', icon: BookOpen, path: '/student/courses' },
    { label: 'Assignments', icon: ClipboardList, path: '/student/assignments' },
    { label: 'My Feedback', icon: MessageSquare, path: '/student/feedback' },
  ],
  parent: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/parent' },
    { label: 'Progress', icon: BarChart3, path: '/parent/progress' },
    { label: 'Feedback', icon: MessageSquare, path: '/parent/feedback' },
  ],
};

const roleGradient = {
  teacher: 'gradient-teacher',
  student: 'gradient-student',
  parent: 'gradient-parent',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = navItems[user.role] || [];
  const gradient = roleGradient[user.role] || 'gradient-teacher';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-border bg-card shadow-soft hidden md:flex">
        <div className={`p-6 ${gradient} text-primary-foreground`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xl">
              {user.role === 'teacher' ? '👨‍🏫' : user.role === 'student' ? '👨‍🎓' : '👨‍👩‍👧'}
            </div>
            <div>
              <p className="font-display font-semibold text-sm">{user.name}</p>
              <p className="text-xs opacity-80 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all focus-accessible ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{user.role === 'teacher' ? '👨‍🏫' : user.role === 'student' ? '👨‍🎓' : '👨‍👩‍👧'}</span>
            <span className="font-display font-semibold text-sm">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <nav className="flex gap-1 mt-2 overflow-x-auto pb-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-28 md:pt-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
