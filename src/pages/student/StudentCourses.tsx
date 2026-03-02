import DashboardLayout from '@/components/DashboardLayout';
import { useAllCourses } from '@/hooks/useStudentCourses';
import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Video, Volume2, File, Play } from 'lucide-react';

const mediaIcons: Record<string, any> = { text: FileText, video: Video, audio: Volume2, document: File };

export default function StudentCourses() {
  const { data: courses = [], isLoading } = useAllCourses();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [activeSubchapter, setActiveSubchapter] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">My Courses</h1>
          <p className="text-muted-foreground text-accessible">Explore your lessons and learn at your own pace.</p>
        </div>

        {isLoading && <p className="text-muted-foreground text-center py-8">Loading courses...</p>}

        {!isLoading && courses.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <span className="text-5xl block mb-4">📚</span>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">No courses available</h3>
            <p className="text-muted-foreground">Check back soon — your teacher will add courses!</p>
          </div>
        )}

        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-soft">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{course.icon || '📚'}</span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">{course.title}</h2>
                    <p className="text-sm text-muted-foreground">{(course as any).teacherName || 'Teacher'}</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <button
                      onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left focus-accessible"
                    >
                      {expandedChapter === chapter.id ? <ChevronDown className="w-5 h-5 text-secondary" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{chapter.title}</p>
                        <p className="text-sm text-muted-foreground">{chapter.subchapters.length} lessons</p>
                      </div>
                    </button>

                    {expandedChapter === chapter.id && (
                      <div className="bg-muted/30 px-4 pb-4 space-y-2">
                        {chapter.subchapters.map((sub) => {
                          const Icon = mediaIcons[sub.media_type || 'text'] || FileText;
                          const isActive = activeSubchapter === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setActiveSubchapter(isActive ? null : sub.id)}
                              className={`w-full text-left bg-card rounded-lg p-4 border transition-all focus-accessible ${isActive ? 'border-secondary shadow-soft' : 'border-border'}`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-secondary/20' : 'bg-muted'}`}>
                                  <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-muted-foreground'}`} />
                                </div>
                                <h4 className="font-semibold text-foreground text-sm flex-1">{sub.title}</h4>
                                {sub.media_type !== 'text' && (
                                  <Play className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              {isActive && sub.content && (
                                <p className="text-sm text-muted-foreground leading-relaxed mt-2 animate-fade-in">
                                  {sub.content}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                {course.chapters.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground italic">No chapters added yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
