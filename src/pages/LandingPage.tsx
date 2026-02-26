import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const roles = [
  {
    label: 'Teacher',
    description: 'Create courses, design assignments, and provide feedback to support your students.',
    emoji: '👨‍🏫',
    gradient: 'gradient-teacher',
  },
  {
    label: 'Student',
    description: 'Access your courses, learn at your own pace, and complete assignments.',
    emoji: '👨‍🎓',
    gradient: 'gradient-student',
  },
  {
    label: 'Parent',
    description: "Monitor your child's progress, view feedback, and stay connected.",
    emoji: '👨‍👩‍👧',
    gradient: 'gradient-parent',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <span className="text-lg">✨</span>
            Inclusive Learning for Everyone
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Learn Without<br /><span className="opacity-90">Boundaries</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            An accessible education platform designed for specially-abled students, connecting teachers, students, and parents.
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 -mt-12 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r, i) => (
            <button
              key={r.label}
              onClick={() => navigate('/auth')}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 text-left focus-accessible animate-fade-in border border-border hover:-translate-y-1"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl ${r.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {r.emoji}
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">{r.label} Portal</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{r.description}</p>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

      </section>

      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        <p>EduAccess — Empowering Inclusive Education</p>
      </footer>
    </div>
  );
}
