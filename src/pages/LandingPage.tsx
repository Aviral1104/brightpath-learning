import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { GraduationCap, BookOpen, Users, ArrowRight } from 'lucide-react';

const roles: { role: UserRole; label: string; description: string; icon: typeof GraduationCap; emoji: string; gradient: string }[] = [
  {
    role: 'teacher',
    label: 'Teacher',
    description: 'Create courses, design assignments, and provide feedback to support your students.',
    icon: BookOpen,
    emoji: '👨‍🏫',
    gradient: 'gradient-teacher',
  },
  {
    role: 'student',
    label: 'Student',
    description: 'Access your courses, learn at your own pace, and complete assignments.',
    icon: GraduationCap,
    emoji: '👨‍🎓',
    gradient: 'gradient-student',
  },
  {
    role: 'parent',
    label: 'Parent',
    description: 'Monitor your child\'s progress, view feedback, and stay connected.',
    icon: Users,
    emoji: '👨‍👩‍👧',
    gradient: 'gradient-parent',
  },
];

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <span className="text-lg">✨</span>
            Inclusive Learning for Everyone
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Learn Without
            <br />
            <span className="opacity-90">Boundaries</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            An accessible education platform designed for specially-abled students,
            connecting teachers, students, and parents in a supportive learning ecosystem.
          </p>
        </div>
      </header>

      {/* Role Selection */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r, i) => (
            <button
              key={r.role}
              onClick={() => handleLogin(r.role)}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 text-left focus-accessible animate-fade-in border border-border hover:-translate-y-1"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              aria-label={`Sign in as ${r.label}`}
            >
              <div className={`w-16 h-16 rounded-2xl ${r.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {r.emoji}
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                {r.label} Portal
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {r.description}
              </p>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                Sign In <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Designed for Accessibility
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            Every feature is thoughtfully crafted to minimize cognitive overload and maximize learning potential.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { icon: '📖', title: 'Large, Clear Text', desc: 'Readable fonts and generous spacing for comfortable reading.' },
              { icon: '🎨', title: 'Calm Colors', desc: 'Low sensory overload with soft, warm color palette.' },
              { icon: '🔊', title: 'Multi-Media', desc: 'Text, audio, video — learn in the way that suits you best.' },
              { icon: '💬', title: 'Direct Feedback', desc: 'Personalized teacher feedback visible to students and parents.' },
            ].map((f, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border animate-fade-in" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        <p>EduAccess — Empowering Inclusive Education</p>
      </footer>
    </div>
  );
}
