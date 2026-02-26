import DashboardLayout from '@/components/DashboardLayout';
import { mockSubmissions, mockAssignments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Star } from 'lucide-react';

export default function TeacherFeedback() {
  const { user } = useAuth();
  const submissions = mockSubmissions;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Student Feedback</h1>
          <p className="text-muted-foreground">Review submissions and provide personalized feedback.</p>
        </div>

        <div className="space-y-4">
          {submissions.map((sub) => {
            const assignment = mockAssignments.find((a) => a.id === sub.assignmentId);
            const scorePercent = Math.round((sub.score / sub.totalQuestions) * 100);
            return (
              <div key={sub.id} className="bg-card rounded-xl border border-border p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">{sub.studentName}</h2>
                    <p className="text-sm text-muted-foreground">{assignment?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-2xl font-bold ${scorePercent >= 80 ? 'text-success' : scorePercent >= 50 ? 'text-warning' : 'text-destructive'}`}>
                      {scorePercent}%
                    </p>
                    <p className="text-xs text-muted-foreground">{sub.score}/{sub.totalQuestions} correct</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all ${scorePercent >= 80 ? 'bg-success' : scorePercent >= 50 ? 'bg-warning' : 'bg-destructive'}`}
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>

                {sub.feedback && (
                  <div className="bg-primary/5 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">Feedback</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{sub.feedback}</p>
                  </div>
                )}

                {sub.insights && (
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-semibold text-secondary">Performance Insights</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{sub.insights}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
