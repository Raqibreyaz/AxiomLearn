import api from "./axios";

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  thumbnail?: string;
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  thumbnail?: string;
}

export const coursesApi = {
  getCourses: async (search?: string): Promise<Course[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get("/courses", { params });
    return data.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const { data } = await api.get(`/courses/${id}`);
    return data.data;
  },

  createCourse: async (payload: CreateCoursePayload): Promise<Course> => {
    const { data } = await api.post("/courses", payload);
    return data.data;
  },

  updateCourse: async (id: string, payload: UpdateCoursePayload): Promise<Course> => {
    const { data } = await api.patch(`/courses/${id}`, payload);
    return data.data;
  },
};
