import DashboardLayout from '@/components/DashboardLayout';
import { mockSubmissions, mockAssignments } from '@/data/mockData';
import { MessageSquare } from 'lucide-react';

export default function ParentFeedback() {
  const studentId = 's1';
  const submissions = mockSubmissions.filter((s) => s.studentId === studentId && s.feedback);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Teacher Feedback</h1>
          <p className="text-muted-foreground text-accessible">All feedback from Alex's teachers in one place.</p>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">💬</span>
            <p className="text-muted-foreground text-lg">No feedback available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const assignment = mockAssignments.find((a) => a.id === sub.assignmentId);
              const scorePercent = Math.round((sub.score / sub.totalQuestions) * 100);
              return (
                <div key={sub.id} className="bg-card rounded-xl border border-border p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display font-bold text-foreground">{assignment?.title}</h2>
                    <span className={`font-display text-xl font-bold ${scorePercent >= 80 ? 'text-success' : 'text-warning'}`}>
                      {scorePercent}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div className={`h-2 rounded-full ${scorePercent >= 80 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${scorePercent}%` }} />
                  </div>
                  <div className="bg-accent/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold text-accent">Teacher's Feedback</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{sub.feedback}</p>
                  </div>
                  {sub.insights && (
                    <div className="bg-secondary/10 rounded-lg p-4 mt-3">
                      <p className="text-sm font-semibold text-secondary mb-1">Performance Insights</p>
                      <p className="text-sm text-foreground leading-relaxed">{sub.insights}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
