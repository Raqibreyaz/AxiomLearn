export interface CourseParams extends Record<string, string> {
  courseId: string;
}

export interface SectionParams extends Record<string, string> {
  courseId: string;
  sectionId: string;
}

export interface LectureParams extends Record<string, string> {
  courseId: string;
  sectionId: string;
  lectureId: string;
}
