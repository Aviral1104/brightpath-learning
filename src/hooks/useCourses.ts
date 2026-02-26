import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DbCourse {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}

export interface DbChapter {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface DbSubchapter {
  id: string;
  chapter_id: string;
  title: string;
  content: string | null;
  media_type: string | null;
  media_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface CourseWithContent extends DbCourse {
  chapters: (DbChapter & { subchapters: DbSubchapter[] })[];
}

export function useCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const coursesQuery = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbCourse[];
    },
    enabled: !!user,
  });

  const createCourse = useMutation({
    mutationFn: async (input: { title: string; description: string; icon: string }) => {
      const { data, error } = await supabase
        .from('courses')
        .insert({ title: input.title, description: input.description, icon: input.icon, teacher_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateCourse = useMutation({
    mutationFn: async (input: { id: string; title: string; description: string; icon: string }) => {
      const { error } = await supabase
        .from('courses')
        .update({ title: input.title, description: input.description, icon: input.icon })
        .eq('id', input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-detail'] });
      toast.success('Course updated!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { courses: coursesQuery.data || [], isLoading: coursesQuery.isLoading, createCourse, deleteCourse, updateCourse };
}

export function useCourseDetail(courseId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: async (): Promise<CourseWithContent | null> => {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId!)
        .single();
      if (error) throw error;

      const { data: chapters } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', courseId!)
        .order('sort_order');

      const chapterIds = (chapters || []).map((c) => c.id);
      let subchapters: DbSubchapter[] = [];
      if (chapterIds.length > 0) {
        const { data } = await supabase
          .from('subchapters')
          .select('*')
          .in('chapter_id', chapterIds)
          .order('sort_order');
        subchapters = (data || []) as DbSubchapter[];
      }

      return {
        ...course,
        chapters: (chapters || []).map((ch) => ({
          ...ch,
          subchapters: subchapters.filter((s) => s.chapter_id === ch.id),
        })),
      } as CourseWithContent;
    },
    enabled: !!courseId,
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ['course-detail', courseId] });

  const addChapter = useMutation({
    mutationFn: async (input: { title: string; description: string }) => {
      const existing = query.data?.chapters.length || 0;
      const { error } = await supabase.from('chapters').insert({
        course_id: courseId!,
        title: input.title,
        description: input.description,
        sort_order: existing,
      });
      if (error) throw error;
    },
    onSuccess: () => { refetch(); toast.success('Chapter added!'); },
    onError: (err: any) => toast.error(err.message),
  });

  const updateChapter = useMutation({
    mutationFn: async (input: { id: string; title: string; description: string }) => {
      const { error } = await supabase.from('chapters').update({ title: input.title, description: input.description }).eq('id', input.id);
      if (error) throw error;
    },
    onSuccess: () => { refetch(); toast.success('Chapter updated!'); },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteChapter = useMutation({
    mutationFn: async (chapterId: string) => {
      const { error } = await supabase.from('chapters').delete().eq('id', chapterId);
      if (error) throw error;
    },
    onSuccess: () => { refetch(); toast.success('Chapter deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const addSubchapter = useMutation({
    mutationFn: async (input: { chapter_id: string; title: string; content: string; media_type: string }) => {
      const chapter = query.data?.chapters.find((c) => c.id === input.chapter_id);
      const existing = chapter?.subchapters.length || 0;
      const { error } = await supabase.from('subchapters').insert({
        chapter_id: input.chapter_id,
        title: input.title,
        content: input.content,
        media_type: input.media_type,
        sort_order: existing,
      });
      if (error) throw error;
    },
    onSuccess: () => { refetch(); toast.success('Lesson added!'); },
    onError: (err: any) => toast.error(err.message),
  });

  const updateSubchapter = useMutation({
    mutationFn: async (input: { id: string; title: string; content: string; media_type: string }) => {
      const { error } = await supabase.from('subchapters').update({
        title: input.title, content: input.content, media_type: input.media_type,
      }).eq('id', input.id);
      if (error) throw error;
    },
    onSuccess: () => { refetch(); toast.success('Lesson updated!'); },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteSubchapter = useMutation({
    mutationFn: async (subId: string) => {
      const { error } = await supabase.from('subchapters').delete().eq('id', subId);
      if (error) throw error;
    },
    onSuccess: () => { refetch(); toast.success('Lesson deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  return {
    course: query.data,
    isLoading: query.isLoading,
    addChapter, updateChapter, deleteChapter,
    addSubchapter, updateSubchapter, deleteSubchapter,
  };
}
