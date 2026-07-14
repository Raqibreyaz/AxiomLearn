import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  coursesApi,
  sectionsApi,
  lecturesApi,
  type CreateCoursePayload,
  type UpdateCoursePayload,
  type CreateSectionPayload,
  type UpdateSectionPayload,
  type CreateLecturePayload,
  type UpdateLecturePayload,
} from "../api/courses.api";

/* ══════════════════════════════════════════════════
   Course hooks
   ══════════════════════════════════════════════════ */

/** Fetch all courses (with optional search query) */
export const useCourses = (search?: string) => {
  return useQuery({
    queryKey: ["courses", search],
    queryFn: () => coursesApi.getCourses(search),
    staleTime: 2 * 60 * 1000,
  });
};

/** Fetch a single course by ID (includes sections) */
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesApi.getCourseById(id),
    enabled: !!id,
  });
};

/** Create a new course */
export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => coursesApi.createCourse(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/** Update course metadata (title, description) */
export const useUpdateCourse = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCoursePayload) => coursesApi.updateCourse(courseId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};

/** Delete a course and all its associated content */
export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => coursesApi.deleteCourse(courseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/** Upload/replace course thumbnail */
export const useUpdateThumbnail = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => coursesApi.updateThumbnail(courseId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/* ══════════════════════════════════════════════════
   Section hooks
   ══════════════════════════════════════════════════ */

/** Create a section inside a course */
export const useCreateSection = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSectionPayload) => sectionsApi.createSection(courseId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};

/** Update a section's title or position */
export const useUpdateSection = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, payload }: { sectionId: string; payload: UpdateSectionPayload }) =>
      sectionsApi.updateSection(courseId, sectionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};

/** Delete a section and all its lectures */
export const useDeleteSection = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: string) => sectionsApi.deleteSection(courseId, sectionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};

/* ══════════════════════════════════════════════════
   Lecture hooks
   ══════════════════════════════════════════════════ */

/** Create a lecture inside a section */
export const useCreateLecture = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, payload }: { sectionId: string; payload: CreateLecturePayload }) =>
      lecturesApi.createLecture(courseId, sectionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};

/** Update a lecture's title, position, or preview flag */
export const useUpdateLecture = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      lectureId,
      payload,
    }: {
      sectionId: string;
      lectureId: string;
      payload: UpdateLecturePayload;
    }) => lecturesApi.updateLecture(courseId, sectionId, lectureId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};

/** Delete a lecture */
export const useDeleteLecture = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, lectureId }: { sectionId: string; lectureId: string }) =>
      lecturesApi.deleteLecture(courseId, sectionId, lectureId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};
