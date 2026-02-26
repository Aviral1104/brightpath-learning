import DashboardLayout from '@/components/DashboardLayout';
import { mockProgress, mockSubmissions, mockAssignments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuth();
  // Parent sees child "s1" data
  const studentId = 's1';
  const progress = mockProgress.filter((p) => p.studentId === studentId);
  const submissions = mockSubmissions.filter((s) => s.studentId === studentId);
  const avgScore = submissions.length
    ? Math.round(submissions.reduce((acc, s) => acc + (s.score / s.totalQuestions) * 100, 0) / submissions.length)
    : 0;

  const totalChapters = progress.reduce((a, p) => a + p.totalChapters, 0);
  const completedChapters = progress.reduce((a, p) => a + p.completedChapters, 0);

  const stats = [
    { label: 'Courses Enrolled', value: progress.length, icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Chapters Done', value: `${completedChapters}/${totalChapters}`, icon: TrendingUp, color: 'bg-secondary/10 text-secondary' },
    { label: 'Average Score', value: `${avgScore}%`, icon: Award, color: 'bg-accent/10 text-accent' },
    { label: 'Assignments', value: submissions.length, icon: Clock, color: 'bg-success/10 text-success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Parent Dashboard 👨‍👩‍👧
          </h1>
          <p className="text-muted-foreground text-accessible">
            Monitoring Alex Rivera's learning progress.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-card rounded-xl p-5 border border-border shadow-soft animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Course Progress</h2>
          <div className="space-y-3">
            {progress.map((p) => {
              const pct = p.totalChapters ? Math.round((p.completedChapters / p.totalChapters) * 100) : 0;
              return (
                <div key={p.courseId} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{p.courseName}</h3>
                    <span className="font-display font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 mb-2">
                    <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{p.completedChapters}/{p.totalChapters} chapters</span>
                    <span>{p.assignmentsCompleted} assignments done</span>
                    <span>Last active: {p.lastActive}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Feedback */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Teacher Feedback</h2>
          <div className="space-y-3">
            {submissions.filter(s => s.feedback).map((sub) => {
              const assignment = mockAssignments.find((a) => a.id === sub.assignmentId);
              return (
                <div key={sub.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">{assignment?.title}</p>
                    <span className="font-display font-bold text-success">{sub.score}/{sub.totalQuestions}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{sub.feedback}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
