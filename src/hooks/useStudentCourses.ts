import { useQuery } from '@tanstack/react-query';
import { getSupabaseClient } from '@/integrations/backend/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CourseWithContent, DbCourse, DbSubchapter } from './useCourses';

export function useAllCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-courses', user?.id],
    queryFn: async (): Promise<CourseWithContent[]> => {
      const supabase = getSupabaseClient();

      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!courses?.length) return [];

      const courseIds = courses.map((c) => c.id);

      const { data: chapters } = await supabase
        .from('chapters')
        .select('*')
        .in('course_id', courseIds)
        .order('sort_order');

      const chapterIds = (chapters || []).map((ch) => ch.id);
      let subchapters: DbSubchapter[] = [];
      if (chapterIds.length > 0) {
        const { data } = await supabase
          .from('subchapters')
          .select('*')
          .in('chapter_id', chapterIds)
          .order('sort_order');
        subchapters = (data || []) as DbSubchapter[];
      }

      // Get teacher profiles for display
      const teacherIds = [...new Set(courses.map((c) => c.teacher_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', teacherIds);
      const teacherNameMap = new Map((profiles || []).map((p) => [p.user_id, p.name]));

      return courses.map((course) => {
        const courseChapters = (chapters || []).filter((ch) => ch.course_id === course.id);
        return {
          ...course,
          teacherName: teacherNameMap.get(course.teacher_id) || 'Teacher',
          chapters: courseChapters.map((ch) => ({
            ...ch,
            subchapters: subchapters.filter((s) => s.chapter_id === ch.id),
          })),
        };
      }) as (CourseWithContent & { teacherName: string })[];
    },
    enabled: !!user,
  });
}
