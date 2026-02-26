import DashboardLayout from '@/components/DashboardLayout';
import { mockAssignments, mockCourses, mockSubmissions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentAssignments() {
  const { user } = useAuth();
  const mySubmissions = mockSubmissions.filter((s) => s.studentId === user?.id);
  const submittedIds = new Set(mySubmissions.map((s) => s.assignmentId));

  // Get assignments from enrolled courses
  const enrolledCourseIds = mockCourses
    .filter((c) => c.enrolledStudents.includes(user?.id || ''))
    .map((c) => c.id);
  const assignments = mockAssignments.filter((a) => enrolledCourseIds.includes(a.courseId));

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [activeAssignment, setActiveAssignment] = useState<string | null>(null);

  const handleSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">My Assignments</h1>
          <p className="text-muted-foreground text-accessible">Complete your assignments at your own pace.</p>
        </div>

        <div className="space-y-4">
          {assignments.map((assignment) => {
            const course = mockCourses.find((c) => c.id === assignment.courseId);
            const submitted = submittedIds.has(assignment.id);
            const submission = mySubmissions.find((s) => s.assignmentId === assignment.id);
            const isActive = activeAssignment === assignment.id;

            return (
              <div key={assignment.id} className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
                <button
                  onClick={() => setActiveAssignment(isActive ? null : assignment.id)}
                  className="w-full p-6 flex items-center justify-between text-left focus-accessible"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${submitted ? 'bg-success/10' : 'bg-primary/10'}`}>
                      {submitted ? <CheckCircle className="w-6 h-6 text-success" /> : <Circle className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">{assignment.title}</h2>
                      <p className="text-sm text-muted-foreground">{course?.icon} {course?.title} • Due: {assignment.dueDate}</p>
                    </div>
                  </div>
                  {submitted && (
                    <span className="font-display font-bold text-success text-xl">{submission?.score}/{submission?.totalQuestions}</span>
                  )}
                </button>

                {isActive && !submitted && (
                  <div className="px-6 pb-6 space-y-4 animate-fade-in">
                    {assignment.questions.map((q, qi) => (
                      <div key={q.id} className="bg-muted/50 rounded-lg p-5">
                        <p className="font-semibold text-foreground mb-3 text-accessible">
                          {qi + 1}. {q.question}
                        </p>
                        <div className="grid gap-2">
                          {q.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => handleSelect(q.id, opt.id)}
                              className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all focus-accessible ${
                                selectedAnswers[q.id] === opt.id
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-card border-border text-foreground hover:bg-muted'
                              }`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full gradient-student text-secondary-foreground border-0 py-6 text-lg font-semibold">
                      Submit Assignment
                    </Button>
                  </div>
                )}

                {isActive && submitted && submission?.feedback && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="bg-primary/5 rounded-lg p-4">
                      <p className="text-sm font-semibold text-primary mb-1">Teacher Feedback</p>
                      <p className="text-sm text-foreground leading-relaxed">{submission.feedback}</p>
                    </div>
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
