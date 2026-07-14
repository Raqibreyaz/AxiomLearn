import api from "./axios";

export interface Course {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  instructor: {
    _id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  language?: "en" | "hi" | "hinglish";
  learningMode?: "live" | "recorded" | "hybrid";
  domain?: string;
  level?: "beginner" | "intermediate" | "advanced" | "all-levels";
  tags?: string[];
  isFeatured?: boolean;
  status?: "draft" | "published" | "archived";
  price?: number;
  originalPrice?: number;
  currency?: string;
  lessonCount?: number;
  totalHours?: string;
  lessons?: any[];
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  _id: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  _id: string;
  title: string;
  position: number;
  isPreview: boolean;
  course: string;
  section: string;
  lectureDurationSeconds: number;
  uploadStatus: "uploaded" | "processing" | "ready" | "failed";
  createdAt: string;
  updatedAt: string;
}

/* ── Payloads ── */

export interface CreateCoursePayload {
  title: string;
  description: string;
  shortDescription: string;
  domain: string;
  thumbnail?: string;
  language?: "en" | "hi" | "hinglish";
  learningMode?: "live" | "recorded" | "hybrid";
  level?: "beginner" | "intermediate" | "advanced" | "all-levels";
  tags?: string[];
  status?: "draft" | "published" | "archived";
  price?: number;
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  shortDescription?: string;
  domain?: string;
  thumbnail?: string;
  language?: "en" | "hi" | "hinglish";
  learningMode?: "live" | "recorded" | "hybrid";
  level?: "beginner" | "intermediate" | "advanced" | "all-levels";
  tags?: string[];
  status?: "draft" | "published" | "archived";
  price?: number;
}

export interface CreateSectionPayload {
  title: string;
  position: number;
}

export interface UpdateSectionPayload {
  title?: string;
  position?: number;
}

export interface CreateLecturePayload {
  title: string;
  position: number;
  isPreview?: boolean;
  lectureDurationSeconds: number;
  uploadStatus: "uploaded" | "processing" | "ready" | "failed";
}

export interface UpdateLecturePayload {
  title?: string;
  position?: number;
  isPreview?: boolean;
}

/* ══════════════════════════════════════════════════
   Course API
   ══════════════════════════════════════════════════ */
export const coursesApi = {
  /* ── Read ── */
  getCourses: async (search?: string): Promise<Course[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get("/courses", { params });
    return data.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const { data } = await api.get(`/courses/${id}`);
    return data.data;
  },

  /* ── Write ── */
  createCourse: async (payload: CreateCoursePayload): Promise<Course> => {
    const { data } = await api.post("/courses", payload);
    return data.data;
  },

  updateCourse: async (id: string, payload: UpdateCoursePayload): Promise<Course> => {
    const { data } = await api.patch(`/courses/${id}`, payload);
    return data.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  updateThumbnail: async (courseId: string, file: File): Promise<Course> => {
    const { data } = await api.post(`/courses/${courseId}/thumbnail`, file, {
      headers: { "Content-Type": file.type },
    });
    return data.data;
  },
};

/* ══════════════════════════════════════════════════
   Section API
   Base: /courses/:courseId/sections
   ══════════════════════════════════════════════════ */
export const sectionsApi = {
  createSection: async (courseId: string, payload: CreateSectionPayload): Promise<Section> => {
    const { data } = await api.post(`/courses/${courseId}/sections`, payload);
    return data.data;
  },

  updateSection: async (courseId: string, sectionId: string, payload: UpdateSectionPayload): Promise<Section> => {
    const { data } = await api.patch(`/courses/${courseId}/sections/${sectionId}`, payload);
    return data.data;
  },

  deleteSection: async (courseId: string, sectionId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/sections/${sectionId}`);
  },
};

/* ══════════════════════════════════════════════════
   Lecture API
   Backend routes: POST /lectures/:courseId/:sectionId
                   PATCH /lectures/:lectureId
                   DELETE /lectures/:lectureId
   Note: these are nested under sections in the route
         file but the actual paths need courseId/sectionId
   ══════════════════════════════════════════════════ */
export const lecturesApi = {
  createLecture: async (
    courseId: string,
    sectionId: string,
    payload: CreateLecturePayload,
  ): Promise<Lecture> => {
    const { data } = await api.post(
      `/courses/${courseId}/sections/${sectionId}/lectures/${courseId}/${sectionId}`,
      payload,
    );
    return data.data;
  },

  updateLecture: async (
    courseId: string,
    sectionId: string,
    lectureId: string,
    payload: UpdateLecturePayload,
  ): Promise<Lecture> => {
    const { data } = await api.patch(
      `/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
      payload,
    );
    return data.data;
  },

  deleteLecture: async (
    courseId: string,
    sectionId: string,
    lectureId: string,
  ): Promise<void> => {
    await api.delete(
      `/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
    );
  },
};
