# AxiomLearn — VeoLMS Challenge Status Report
> Deadline: **15 July 2026** | Based on codebase snapshot as of 15 July 2026 23:18 IST

---

## ✅ What Is Completed

### 1. Authentication (Requirement #5)
- Session-based auth (cookie `sessionId`), no JWT
- `signup`, `login`, `logout`, `getMe` controllers — all working
- Zod schema validation on every auth route
- Password hashing via mongoose pre-save hook (`comparePassword`)
- Account suspension check on login (`isSuspended` flag)
- Role-based authorization middleware (`authorizeRoles`)
- `ProtectedRoute` + `RoleRoute` components on frontend (3 roles: student / instructor / admin)
- Profile update + avatar upload with old-file cleanup

### 2. Public Homepage (Requirement #2)
- `LandingPage.tsx` — hero section, stat row, course grid, search bar, category chips, testimonial section, footer, dark strip
- `CourseCard.tsx`, `CategoryChips.tsx`, `SearchBar.tsx`, `Footer.tsx` components built
- Course grid filters by domain + live data from API

### 3. Public Course Pages (Requirement #3)
- `CourseDetailPage.tsx` — full dark hero with: title, instructor name/avatar, short description, domain pill, meta badges (language, level, learning mode), tags, total lessons count, total duration
- Sticky buy card with price/original price/discount %, "Enroll now" CTA
- `CurriculumAccordion` showing all sections + lectures with lock/free-preview state
- Instructor card with bio, About the course section
- Breadcrumb nav

### 4. Admin Dashboard (Requirement #8 — partial)
- `AdminPage.tsx` — KPI cards for published/draft counts, live course table with search, Edit button per course
- `AdminUsersPage.tsx` — lists students and instructors by role
- Admin can promote/demote users via `PATCH /api/v1/auth/users/:userId/role`
- Admin sidebar with navigation (courses, students, instructors)

### 5. Course CRUD — Backend (Requirement #8)
- `POST /api/v1/courses` — create course (instructor/admin)
- `GET /api/v1/courses` — list with search, domain, level, status filters + role-aware visibility
- `GET /api/v1/courses/:courseId` — full detail with nested sections + lectures
- `PATCH /api/v1/courses/:courseId` — update with ownership check
- `DELETE /api/v1/courses/:courseId` — cascading delete (lectures, sections, progress records)
- `POST /api/v1/courses/:courseId/thumbnail` — upload thumbnail to Cloudflare R2

### 6. Section & Lecture CRUD — Backend
- Create / update / delete sections
- Create lecture with presigned R2 upload URL (direct-to-R2 upload flow)
- Update lecture (including `isUploading: false` on upload complete)
- Delete lecture + video from R2 (`deleteLectureVideo`)
- `getLectureStreamUrl` — generates time-limited presigned GET URL (5 min)

### 7. Course Creator UI — Frontend (Requirement #8 admin)
- `CreateCoursePage.tsx` — full form with all metadata fields
- `EditCoursePage.tsx` — full course editor (sections, lectures, video upload, thumbnail, publish/draft toggle)
- Video upload via presigned URL directly to Cloudflare R2

### 8. Video Player (Requirement #9)
- `CoursePlayerPage.tsx` — Vidstack player with `DefaultVideoLayout`
- Secure presigned stream URL fetched per lecture
- Curriculum sidebar with active lesson highlighting + lesson navigation
- Keyboard shortcuts, fullscreen, speed controls, PiP — all come free from Vidstack
- URL-param based lesson state (`?lesson=<id>`) — browser back/forward works

### 9. Cloud Storage — Bonus ✓
- Cloudflare R2 for both images (public bucket) and videos (private bucket)
- Cost-effective: no egress fees on R2

### 10. Security Fundamentals
- Input validation via Zod on every route (no raw `req.body` usage)
- Stored XSS prevention via sanitization on Mongoose schemas
- `validateObjectId` middleware to block malformed IDs
- Session-based auth (no JWT in localStorage = no XSS token theft)
- `authorizeCourseAccess` middleware (ownership check before mutating a course)
- Admin cannot be promoted/demoted via the general role route
- `isSuspended` check prevents banned users from logging in

---

## ⚠️ Done But Needs Better Handling

### 1. Video Stream Authorization (`getLectureStreamUrl`)
**Current:** Any authenticated session can get a presigned URL for *any* lecture ID — no enrollment check.
```ts
// TODO: Add authorization checks (e.g., is user enrolled? is it a free preview?)
// For now, if the lecture exists, we grant the stream URL.
```
**Needed:** Check if `isPreview === true` (allow anyone) OR user is enrolled in the course before issuing the URL.

### 2. `deleteCourse` — Orphaned R2 Videos
**Current:** Deletes DB records but has an explicit TODO:
```ts
// TODO: delete lectures from s3 as well
```
Lecture video files in R2's `R2_TEMP_BUCKET` are never cleaned up on course delete.

### 3. `getFilePresignedUrl` — Wrong Bucket for Streaming
**Current:** Videos are read from `R2_TEMP_BUCKET`. For production, processed videos should live in a permanent/private bucket. Using the temp bucket for streaming means videos could be overwritten or expired.

### 4. Dashboard — Completely Placeholder
`DashboardPage.tsx` shows 4 KPI cards all hardcoded to `"0"` with no real data:
- Enrolled courses count
- Hours learned
- Lessons completed
- Certificates
The "Continue Learning" section shows a static empty state. Needs to call enrollment + progress APIs.

### 5. Admin KPIs — Partial Placeholders
```
Active students — "Enrollment API pending"
Revenue — "Payments pending"
Recent enrollments table — static "Enrollment API pending"
```

### 6. Course Player — Lock Logic is Incomplete
```ts
isLocked: !lec.isPreview && !user,  // Very basic lock logic for now
```
Any logged-in user (even one not enrolled) can watch any non-preview lecture. Should check enrollment status.

### 7. `uploadFile` in `s3.service.ts` — Hardcoded ContentType
```ts
ContentType: "image/jpeg",  // Hardcoded
```
Avatar and thumbnail uploads always upload as `image/jpeg` regardless of actual file type. Should use `req.file.mimetype`.

### 8. Error Handling on Stream Fetch in Player
```ts
} catch (err) {
  console.error("Failed to fetch stream URL", err);
}
```
The error is swallowed — the user just sees "No lesson selected or failed to load" with no actionable message or retry UI.

---

## ❌ Not Yet Implemented (Missing Requirements)

### 🔴 CRITICAL MISSING — Enrollment & Payments (Requirement #6)
This is a **mandatory requirement** and is completely absent:
- No Enrollment model
- No payment gateway (Razorpay or Stripe)
- No payment verification
- No enrollment record creation after payment
- The "Enroll now" button on `CourseDetailPage` does nothing (no `onClick`)

### 🔴 CRITICAL MISSING — Live Deployment (Requirement #1)
- Nothing is deployed. The challenge explicitly states the evaluator must be able to open and use the app without running it locally.
- No deployment config files, no Dockerfile, no Render/Railway/Vercel setup.

### 🔴 Student Dashboard — Real Data (Requirement #7)
- "My Courses" — not implemented (needs enrollment API)
- "Continue Learning" — not implemented (needs progress API)
- "Progress Tracking" — models exist (`CourseProgress`, `LectureProgress`) but no API endpoints exist for students to read/write their progress
- "Recently Watched Lessons" — not implemented

### 🟠 HIGH — Progress Tracking API
- `CourseProgress` and `LectureProgress` models are defined
- No controllers or routes to:
  - Mark a lecture as complete
  - Get progress for a course
  - Update `lastLecture` / `lastActivityAt`
  - Resume playback (save/restore `watchedSeconds` per lecture)

### 🟠 HIGH — Public Course Browse Page
`CoursesPage.tsx` exists (3.2 KB) but is minimal — needs to be verified it has proper filtering, search results, pagination.

### 🟠 HIGH — Content in the System
The challenge requires **at least 3 courses** with **at least 5 lessons each** seeded in the live deployment. Currently no seed data exists.

### 🟡 MEDIUM — Bonus: HLS Streaming
- Currently raw MP4 presigned URLs — no HLS transcoding pipeline
- Would require Lambda + FFmpeg or a similar serverless processing job

### 🟡 MEDIUM — Bonus: Video Quality Selection
- Not implemented (follows from HLS)

### 🟡 MEDIUM — Automated Testing
- No test files anywhere in the codebase

### 🟡 MEDIUM — Submission Email Content
The challenge requires a written submission email with:
- Architecture explanation
- Tech stack justification
- Cost estimation breakdown
- "Why VeoLMS" personal statement
- Challenges faced

---

## Priority Order for Remaining Work

| Priority | Task | Effort |
|----------|------|--------|
| 🔴 P0 | Enrollment + Razorpay/Stripe integration | Large |
| 🔴 P0 | Deploy to Render / Railway / Vercel | Medium |
| 🔴 P0 | Progress tracking API (mark complete, resume) | Medium |
| 🔴 P0 | Real student dashboard (enrolled courses, progress) | Medium |
| 🟠 P1 | Fix stream authorization (enrollment check) | Small |
| 🟠 P1 | Fix deleteCourse — delete R2 videos | Small |
| 🟠 P1 | Fix "Enroll now" button to trigger payment | Small |
| 🟠 P1 | Seed 3+ courses with 5+ lessons each | Small |
| 🟡 P2 | Fix ContentType hardcoding in s3.service | Tiny |
| 🟡 P2 | Better error UI in CoursePlayerPage | Tiny |
| 🟡 P2 | Admin enrollment + revenue KPIs | Medium |
| 🟡 P3 | HLS pipeline (bonus) | Large |
| 🟡 P3 | Automated tests (bonus) | Medium |
| 🟡 P3 | Write submission email | Small |
