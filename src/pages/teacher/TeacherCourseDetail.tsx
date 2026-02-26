import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useCourseDetail, useCourses } from '@/hooks/useCourses';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  ChevronDown, ChevronRight, Plus, Trash2, Edit2, Save, ArrowLeft,
  FileText, Video, Volume2, File,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const mediaIcons: Record<string, any> = { text: FileText, video: Video, audio: Volume2, document: File };

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, isLoading, addChapter, updateChapter, deleteChapter, addSubchapter, updateSubchapter, deleteSubchapter } = useCourseDetail(courseId);
  const { updateCourse } = useCourses();

  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Edit course info
  const [editingCourse, setEditingCourse] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIcon, setEditIcon] = useState('');

  // Add chapter dialog
  const [chapterDialog, setChapterDialog] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');

  // Edit chapter
  const [editChapterId, setEditChapterId] = useState<string | null>(null);
  const [editChapterTitle, setEditChapterTitle] = useState('');
  const [editChapterDesc, setEditChapterDesc] = useState('');

  // Add subchapter dialog
  const [subDialog, setSubDialog] = useState<string | null>(null);
  const [subTitle, setSubTitle] = useState('');
  const [subContent, setSubContent] = useState('');
  const [subMediaType, setSubMediaType] = useState('text');

  // Edit subchapter
  const [editSubId, setEditSubId] = useState<string | null>(null);
  const [editSubTitle, setEditSubTitle] = useState('');
  const [editSubContent, setEditSubContent] = useState('');
  const [editSubMediaType, setEditSubMediaType] = useState('text');

  if (isLoading) return <DashboardLayout><p className="text-muted-foreground text-center py-16">Loading course...</p></DashboardLayout>;
  if (!course) return <DashboardLayout><p className="text-muted-foreground text-center py-16">Course not found.</p></DashboardLayout>;

  const startEditCourse = () => {
    setEditTitle(course.title);
    setEditDesc(course.description || '');
    setEditIcon(course.icon || '📚');
    setEditingCourse(true);
  };

  const saveCourse = async () => {
    await updateCourse.mutateAsync({ id: course.id, title: editTitle, description: editDesc, icon: editIcon });
    setEditingCourse(false);
  };

  const handleAddChapter = async () => {
    if (!chapterTitle.trim()) return;
    await addChapter.mutateAsync({ title: chapterTitle, description: chapterDesc });
    setChapterTitle(''); setChapterDesc(''); setChapterDialog(false);
  };

  const startEditChapter = (ch: any) => {
    setEditChapterId(ch.id); setEditChapterTitle(ch.title); setEditChapterDesc(ch.description || '');
  };

  const saveChapter = async () => {
    if (!editChapterId) return;
    await updateChapter.mutateAsync({ id: editChapterId, title: editChapterTitle, description: editChapterDesc });
    setEditChapterId(null);
  };

  const handleAddSub = async () => {
    if (!subDialog || !subTitle.trim()) return;
    await addSubchapter.mutateAsync({ chapter_id: subDialog, title: subTitle, content: subContent, media_type: subMediaType });
    setSubTitle(''); setSubContent(''); setSubMediaType('text'); setSubDialog(null);
  };

  const startEditSub = (sub: any) => {
    setEditSubId(sub.id); setEditSubTitle(sub.title); setEditSubContent(sub.content || ''); setEditSubMediaType(sub.media_type || 'text');
  };

  const saveSub = async () => {
    if (!editSubId) return;
    await updateSubchapter.mutateAsync({ id: editSubId, title: editSubTitle, content: editSubContent, media_type: editSubMediaType });
    setEditSubId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button onClick={() => navigate('/teacher/courses')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
          {editingCourse ? (
            <div className="space-y-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label>Title</Label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="mt-1 w-20 text-center text-xl" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="mt-1" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveCourse} disabled={updateCourse.isPending} className="gap-2 gradient-teacher text-primary-foreground border-0">
                  <Save className="w-4 h-4" /> {updateCourse.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" onClick={() => setEditingCourse(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <span className="text-4xl">{course.icon || '📚'}</span>
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold text-foreground">{course.title}</h1>
                <p className="text-muted-foreground mt-1">{course.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{course.chapters.length} chapters</p>
              </div>
              <Button variant="outline" size="sm" onClick={startEditCourse} className="gap-2">
                <Edit2 className="w-4 h-4" /> Edit
              </Button>
            </div>
          )}
        </div>

        {/* Chapters */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Chapters</h2>
          <Button size="sm" onClick={() => setChapterDialog(true)} className="gap-2 gradient-teacher text-primary-foreground border-0">
            <Plus className="w-4 h-4" /> Add Chapter
          </Button>
        </div>

        {course.chapters.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No chapters yet. Add your first chapter to start building content.</p>
          </div>
        )}

        <div className="space-y-4">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-soft">
              <div className="p-4 flex items-center gap-3">
                <button onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)} className="flex items-center gap-3 flex-1 text-left">
                  {expandedChapter === chapter.id ? <ChevronDown className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <p className="font-semibold text-foreground">{chapter.title}</p>
                    <p className="text-sm text-muted-foreground">{chapter.description}</p>
                  </div>
                </button>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{chapter.subchapters.length} lessons</span>
                <Button variant="ghost" size="icon" onClick={() => startEditChapter(chapter)} title="Edit"><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteChapter.mutate(chapter.id)} className="hover:text-destructive" title="Delete"><Trash2 className="w-4 h-4" /></Button>
              </div>

              {expandedChapter === chapter.id && (
                <div className="bg-muted/30 px-4 pb-4 space-y-2 border-t border-border pt-3">
                  {chapter.subchapters.map((sub) => {
                    const Icon = mediaIcons[sub.media_type || 'text'] || FileText;
                    if (editSubId === sub.id) {
                      return (
                        <div key={sub.id} className="bg-card rounded-lg p-4 border border-primary space-y-3">
                          <Input value={editSubTitle} onChange={(e) => setEditSubTitle(e.target.value)} placeholder="Lesson title" />
                          <Textarea value={editSubContent} onChange={(e) => setEditSubContent(e.target.value)} placeholder="Content" rows={4} />
                          <Select value={editSubMediaType} onValueChange={setEditSubMediaType}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveSub} disabled={updateSubchapter.isPending} className="gap-1"><Save className="w-3 h-3" /> Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditSubId(null)}>Cancel</Button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={sub.id} className="bg-card rounded-lg p-4 border border-border group/sub">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <h4 className="font-semibold text-foreground text-sm flex-1">{sub.title}</h4>
                          {sub.media_type && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">{sub.media_type}</span>}
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/sub:opacity-100" onClick={() => startEditSub(sub)}><Edit2 className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/sub:opacity-100 hover:text-destructive" onClick={() => deleteSubchapter.mutate(sub.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{sub.content}</p>
                      </div>
                    );
                  })}
                  <Button variant="outline" size="sm" onClick={() => setSubDialog(chapter.id)} className="w-full gap-2 mt-2">
                    <Plus className="w-4 h-4" /> Add Lesson
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Chapter Dialog */}
        <Dialog open={chapterDialog} onOpenChange={setChapterDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="font-display">Add Chapter</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title *</Label><Input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} className="mt-1" placeholder="Chapter title" /></div>
              <div><Label>Description</Label><Input value={chapterDesc} onChange={(e) => setChapterDesc(e.target.value)} className="mt-1" placeholder="Brief description" /></div>
              <Button onClick={handleAddChapter} disabled={addChapter.isPending} className="w-full gradient-teacher text-primary-foreground border-0">
                {addChapter.isPending ? 'Adding...' : 'Add Chapter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Chapter Dialog */}
        <Dialog open={!!editChapterId} onOpenChange={(open) => !open && setEditChapterId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="font-display">Edit Chapter</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title</Label><Input value={editChapterTitle} onChange={(e) => setEditChapterTitle(e.target.value)} className="mt-1" /></div>
              <div><Label>Description</Label><Input value={editChapterDesc} onChange={(e) => setEditChapterDesc(e.target.value)} className="mt-1" /></div>
              <Button onClick={saveChapter} disabled={updateChapter.isPending} className="w-full gradient-teacher text-primary-foreground border-0">
                {updateChapter.isPending ? 'Saving...' : 'Save Chapter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Subchapter Dialog */}
        <Dialog open={!!subDialog} onOpenChange={(open) => !open && setSubDialog(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle className="font-display">Add Lesson</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title *</Label><Input value={subTitle} onChange={(e) => setSubTitle(e.target.value)} className="mt-1" placeholder="Lesson title" /></div>
              <div><Label>Content</Label><Textarea value={subContent} onChange={(e) => setSubContent(e.target.value)} className="mt-1" rows={5} placeholder="Lesson content..." /></div>
              <div>
                <Label>Media Type</Label>
                <Select value={subMediaType} onValueChange={setSubMediaType}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddSub} disabled={addSubchapter.isPending} className="w-full gradient-teacher text-primary-foreground border-0">
                {addSubchapter.isPending ? 'Adding...' : 'Add Lesson'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
