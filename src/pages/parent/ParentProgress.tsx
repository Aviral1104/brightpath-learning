import DashboardLayout from '@/components/DashboardLayout';
import { mockProgress } from '@/data/mockData';
import { TrendingUp } from 'lucide-react';

export default function ParentProgress() {
  const studentId = 's1';
  const progress = mockProgress.filter((p) => p.studentId === studentId);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Detailed Progress</h1>
          <p className="text-muted-foreground text-accessible">Track Alex's learning journey across all courses.</p>
        </div>

        <div className="space-y-4">
          {progress.map((p) => {
            const pct = p.totalChapters ? Math.round((p.completedChapters / p.totalChapters) * 100) : 0;
            return (
              <div key={p.courseId} className="bg-card rounded-xl border border-border p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">{p.courseName}</h2>
                    <p className="text-sm text-muted-foreground">Last active: {p.lastActive}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-display font-bold text-lg ${pct >= 75 ? 'border-success text-success' : pct >= 40 ? 'border-warning text-warning' : 'border-primary text-primary'}`}>
                    {pct}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="font-display font-bold text-foreground">{p.completedChapters}</p>
                    <p className="text-xs text-muted-foreground">Chapters Done</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="font-display font-bold text-foreground">{p.totalChapters}</p>
                    <p className="text-xs text-muted-foreground">Total Chapters</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="font-display font-bold text-foreground">{p.assignmentsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Assignments</p>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${pct >= 75 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
