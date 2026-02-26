import DashboardLayout from '@/components/DashboardLayout';
import { mockCourses, mockAssignments, mockSubmissions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ClipboardList, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const courses = mockCourses.filter((c) => c.enrolledStudents.includes(user?.id || ''));
  const mySubmissions = mockSubmissions.filter((s) => s.studentId === user?.id);
  const avgScore = mySubmissions.length
    ? Math.round(mySubmissions.reduce((acc, s) => acc + (s.score / s.totalQuestions) * 100, 0) / mySubmissions.length)
    : 0;

  const stats = [
    { label: 'Enrolled Courses', value: courses.length, icon: BookOpen, color: 'bg-secondary/10 text-secondary' },
    { label: 'Assignments Done', value: mySubmissions.length, icon: ClipboardList, color: 'bg-primary/10 text-primary' },
    { label: 'Average Score', value: `${avgScore}%`, icon: Award, color: 'bg-accent/10 text-accent' },
    { label: 'Keep Going!', value: '🌟', icon: TrendingUp, color: 'bg-success/10 text-success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Hi, {user?.name?.split(' ')[0]}! 🎉
          </h1>
          <p className="text-muted-foreground text-accessible">
            Ready to learn something amazing today?
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

        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">My Courses</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => (
              <Link key={course.id} to="/student/courses" className="block">
                <div className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-all hover:-translate-y-0.5 animate-fade-in" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                  <span className="text-4xl mb-3 block">{course.icon}</span>
                  <h3 className="font-display font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                  <p className="text-xs text-muted-foreground">{course.chapters.length} chapters • {course.teacherName}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {mySubmissions.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Recent Feedback</h2>
            <div className="space-y-3">
              {mySubmissions.filter(s => s.feedback).map((sub) => {
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
        )}
      </div>
    </DashboardLayout>
  );
}
