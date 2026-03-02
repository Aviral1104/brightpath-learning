import DashboardLayout from '@/components/DashboardLayout';
import { useAllCourses } from '@/hooks/useStudentCourses';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuth();
  const { data: courses = [], isLoading } = useAllCourses();

  const totalChapters = courses.reduce((a, c) => a + c.chapters.length, 0);
  const totalLessons = courses.reduce((a, c) => a + c.chapters.reduce((b, ch) => b + ch.subchapters.length, 0), 0);

  const stats = [
    { label: 'Courses Available', value: courses.length, icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Total Chapters', value: totalChapters, icon: TrendingUp, color: 'bg-secondary/10 text-secondary' },
    { label: 'Total Lessons', value: totalLessons, icon: Award, color: 'bg-accent/10 text-accent' },
    { label: 'Learning!', value: '📖', icon: Clock, color: 'bg-success/10 text-success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Parent Dashboard 👨‍👩‍👧
          </h1>
          <p className="text-muted-foreground text-accessible">
            Monitor your child's available learning content.
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
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Available Courses</h2>
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl">{course.icon || '📚'}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                  <span>{course.chapters.length} chapters</span>
                  <span>{course.chapters.reduce((a, ch) => a + ch.subchapters.length, 0)} lessons</span>
                  <span>By {(course as any).teacherName || 'Teacher'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
