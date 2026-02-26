import DashboardLayout from '@/components/DashboardLayout';
import { mockAssignments, mockCourses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const difficultyColors = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function TeacherAssignments() {
  const { user } = useAuth();
  const assignments = mockAssignments.filter((a) => a.teacherId === user?.id);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Assignments</h1>
          <p className="text-muted-foreground">Create and manage MCQ assignments for your students.</p>
        </div>

        <div className="space-y-4">
          {assignments.map((assignment) => {
            const course = mockCourses.find((c) => c.id === assignment.courseId);
            return (
              <div key={assignment.id} className="bg-card rounded-xl border border-border p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">{assignment.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course?.icon} {course?.title}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border capitalize ${difficultyColors[assignment.difficulty]}`}>
                    {assignment.difficulty}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span>{assignment.questions.length} questions</span>
                  <span>Due: {assignment.dueDate}</span>
                </div>

                <div className="space-y-3">
                  {assignment.questions.map((q, qi) => (
                    <div key={q.id} className="bg-muted/50 rounded-lg p-4">
                      <p className="font-medium text-foreground text-sm mb-2">
                        {qi + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`text-xs px-3 py-2 rounded-lg border ${
                              opt.isCorrect
                                ? 'bg-success/10 border-success/30 text-success'
                                : 'bg-card border-border text-muted-foreground'
                            }`}
                          >
                            {opt.text} {opt.isCorrect && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
