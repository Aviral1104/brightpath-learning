import DashboardLayout from '@/components/DashboardLayout';
import { mockCourses, mockAssignments, mockSubmissions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ClipboardList, MessageSquare, Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const courses = mockCourses.filter((c) => c.teacherId === user?.id);
  const assignments = mockAssignments.filter((a) => a.teacherId === user?.id);
  const pendingFeedback = mockSubmissions.filter((s) => !s.feedback);

  const stats = [
    { label: 'Courses', value: courses.length, icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Assignments', value: assignments.length, icon: ClipboardList, color: 'bg-secondary/10 text-secondary' },
    { label: 'Students', value: new Set(courses.flatMap((c) => c.enrolledStudents)).size, icon: Users, color: 'bg-accent/10 text-accent' },
    { label: 'Pending Reviews', value: pendingFeedback.length, icon: MessageSquare, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground text-accessible">
            Here's an overview of your teaching activities.
          </p>
        </div>

        {/* Stats */}
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

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link to="/teacher/courses">
            <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
              <Plus className="w-4 h-4" /> Create Course
            </Button>
          </Link>
          <Link to="/teacher/assignments">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Create Assignment
            </Button>
          </Link>
        </div>

        {/* Recent Courses */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Your Courses</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => (
              <Link key={course.id} to="/teacher/courses" className="block">
                <div className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-all hover:-translate-y-0.5 animate-fade-in" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                  <span className="text-3xl mb-3 block">{course.icon}</span>
                  <h3 className="font-display font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{course.chapters.length} chapters</span>
                    <span>{course.enrolledStudents.length} students</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Recent Submissions</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {mockSubmissions.map((sub) => {
              const assignment = mockAssignments.find((a) => a.id === sub.assignmentId);
              return (
                <div key={sub.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{sub.studentName}</p>
                    <p className="text-sm text-muted-foreground">{assignment?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-foreground">{sub.score}/{sub.totalQuestions}</p>
                    <p className="text-xs text-muted-foreground">{sub.submittedAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
