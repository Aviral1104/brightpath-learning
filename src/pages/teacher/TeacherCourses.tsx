import DashboardLayout from '@/components/DashboardLayout';
import { mockCourses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Video, Volume2, File, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Course, Chapter, Subchapter } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const mediaIcons = {
  text: FileText,
  video: Video,
  audio: Volume2,
  document: File,
};

const iconOptions = ['📚', '🏛️', '🧮', '📐', '🔬', '🎨', '🌍', '💻', '📝', '🎵'];

export default function TeacherCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(
    mockCourses.filter((c) => c.teacherId === (user?.id || 't1'))
  );
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Create course form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('📚');

  const handleCreateCourse = () => {
    if (!newTitle.trim()) {
      toast.error('Course title is required');
      return;
    }
    const newCourse: Course = {
      id: `c${Date.now()}`,
      title: newTitle,
      description: newDesc,
      teacherId: user?.id || 't1',
      teacherName: user?.name || 'Teacher',
      enrolledStudents: [],
      color: 'primary',
      icon: newIcon,
      chapters: [],
    };
    setCourses([...courses, newCourse]);
    setNewTitle('');
    setNewDesc('');
    setNewIcon('📚');
    setDialogOpen(false);
    toast.success('Course created successfully!');
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    toast.success('Course deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">Your Courses</h1>
            <p className="text-muted-foreground">Manage your courses, chapters, and subchapters.</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
                <Plus className="w-4 h-4" /> Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Create New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Course Icon</Label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewIcon(icon)}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border transition-all ${
                          newIcon === icon ? 'border-primary bg-primary/10 scale-110' : 'border-border bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="courseTitle">Title *</Label>
                  <Input
                    id="courseTitle"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. World History"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="courseDesc">Description</Label>
                  <Input
                    id="courseDesc"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Brief description of the course"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleCreateCourse} className="w-full gradient-teacher text-primary-foreground border-0">
                  Create Course
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <span className="text-5xl block mb-4">📚</span>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">Create your first course to get started.</p>
          </div>
        )}

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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Delete course"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
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
