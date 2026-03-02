import DashboardLayout from '@/components/DashboardLayout';
import { useAllCourses } from '@/hooks/useStudentCourses';

export default function ParentProgress() {
  const { data: courses = [], isLoading } = useAllCourses();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Detailed Progress</h1>
          <p className="text-muted-foreground text-accessible">Track learning content across all courses.</p>
        </div>

        {isLoading && <p className="text-muted-foreground text-center py-8">Loading...</p>}

        <div className="space-y-4">
          {courses.map((course) => {
            const totalLessons = course.chapters.reduce((a, ch) => a + ch.subchapters.length, 0);
            return (
              <div key={course.id} className="bg-card rounded-xl border border-border p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{course.icon || '📚'}</span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">{course.title}</h2>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="font-display font-bold text-foreground">{course.chapters.length}</p>
                    <p className="text-xs text-muted-foreground">Chapters</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="font-display font-bold text-foreground">{totalLessons}</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="font-display font-bold text-foreground">{(course as any).teacherName || 'Teacher'}</p>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                  </div>
                </div>
              </div>
            );
          })}

          {!isLoading && courses.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <span className="text-5xl block mb-4">📊</span>
              <p className="text-muted-foreground">No courses to track yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
