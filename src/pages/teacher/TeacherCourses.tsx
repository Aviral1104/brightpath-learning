import DashboardLayout from '@/components/DashboardLayout';
import { mockCourses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Video, Volume2, File } from 'lucide-react';

const mediaIcons = {
  text: FileText,
  video: Video,
  audio: Volume2,
  document: File,
};

export default function TeacherCourses() {
  const { user } = useAuth();
  const courses = mockCourses.filter((c) => c.teacherId === user?.id);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Your Courses</h1>
          <p className="text-muted-foreground">Manage your courses, chapters, and subchapters.</p>
        </div>

        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-soft">
              <div className="p-6 border-b border-border">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{course.icon}</span>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold text-foreground">{course.title}</h2>
                    <p className="text-muted-foreground mt-1">{course.description}</p>
                    <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                      <span>{course.chapters.length} chapters</span>
                      <span>{course.enrolledStudents.length} students enrolled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <button
                      onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left focus-accessible"
                      aria-expanded={expandedChapter === chapter.id}
                    >
                      {expandedChapter === chapter.id ? (
                        <ChevronDown className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{chapter.title}</p>
                        <p className="text-sm text-muted-foreground">{chapter.description}</p>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {chapter.subchapters.length} lessons
                      </span>
                    </button>

                    {expandedChapter === chapter.id && (
                      <div className="bg-muted/30 px-4 pb-4 space-y-2">
                        {chapter.subchapters.map((sub) => {
                          const Icon = mediaIcons[sub.mediaType || 'text'];
                          return (
                            <div key={sub.id} className="bg-card rounded-lg p-4 border border-border">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-primary" />
                                </div>
                                <h4 className="font-semibold text-foreground text-sm">{sub.title}</h4>
                                {sub.mediaType && (
                                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">
                                    {sub.mediaType}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{sub.content}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
