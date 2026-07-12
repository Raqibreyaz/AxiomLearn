import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi, type CreateCoursePayload, type UpdateCoursePayload } from "../api/courses.api";

export const useCourses = (search?: string) => {
  return useQuery({
    queryKey: ["courses", search],
    queryFn: () => coursesApi.getCourses(search),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesApi.getCourseById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => coursesApi.createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateCourse = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCoursePayload) => coursesApi.updateCourse(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
    },
  });
};
