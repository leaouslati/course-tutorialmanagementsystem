# CourseHub

## Team Members:
- Lea Ouslati
- Reem Antar
- Intissar Soulaiman
- Reem Nassif


## Assigned Topic:
We developed a Course Tutorial Management System to help manage tutorials, courses, and student progress.


### Primary Data Entities 
- **Users** – Represents all users of the system, including students and instructors. Each user has a unique ID, name, email, role, enrolled courses, created courses, progress in courses, and other profile information.

- **Courses** – Represents the different courses available in the system. Each course includes details like title, description, category, difficulty level, instructor, duration, rating, number of students, and associated modules.

- **Modules** – Each course is broken into modules. A module contains a set of lessons and has an order to define the learning sequence.

- **Lessons** – Represents the individual lessons within modules. Each lesson includes a title, content description, duration, and a video URL for learning purposes.


## Deployed Application
Access the live application here:  add link

## Setup Instructions for Running Frontend Locally
1. **Clone the repository:**
   git clone [https://github.com/leaouslati/course-tutorialmanagementsystem.git]
   cd course-tutorial-system

2. **Install dependencies:**
   npm install

3. **Start the development server:**
   npm run dev
   
4. **Open your browser:**
   localhost: 5173
   Go to [http://localhost:5173] to view the app.

**Requirements:**
- Node.js (v16 or higher recommended)


## Screenshots of Important Features



## Team Member Contributions

### Member 1: Lea Ouslati
- Responsible for: Homepage & Login Page
- Contributions:
    - Set up React Router to handle app navigation between pages.
    - Designed and implemented the Homepage, including layout, featured courses, navigation links, and    related statistics
    - Developed the Login Page with form validation and integration with mock user data.
    - Managed and organized the GitHub repository to ensure working on branches and merging when needed 

### Member 2: Reem Antar 
- Responsible for: CourseCard, CourseDetails, and Courses pages
- Contributions:
   - Built the CourseCard component to showcase courses with key info like title, instructor, difficulty, duration, and ratings, including dynamic badges for new or recently updated courses.
   - Designed the CourseDetails page, allowing users to explore full course info, view modules and lessons, enroll in courses, and receive real-time notifications for actions.
   - Created the Courses page with search, filters, and sorting options. We thought carefully about filtering and searching: users can filter by difficulty or category, search by course title, and sort by rating or duration making it simple to quickly find the course that fits their needs.
   - Defined and structured the modules dataset in mockdata.js, including module IDs, titles, order, and lesson references, enabling dynamic rendering of course modules across the platform.

### Member 3: Intissar Soulaiman
- Responsible for: Navbar, Profile Page, and Enrollments Page.
- Contributions:
   - Built the Navbar component and organized it inside the components folder, including the navigation menu, page links, and theme toggle button. Also updated it so the Enrollments link only appears when the user is logged in.
   - Designed and implemented the Profile Page with user information, quick actions, badges, ID card modal, and edit profile modal. Added responsive layouts so the page works well on mobile, tablet, and desktop screens.
   - Developed the Enrollments Page to display each student’s enrolled courses with progress bars, course status, module and lesson counts, and continue actions. Also added unenroll confirmation handling and responsive card layouts
   - Expanded and structured the mock data in mockdata.js by adding more courses, users, lessons, and modules, with different progress values to make testing more realistic and to support dynamic rendering across the app.
   - Continuously tested the pages during development to make sure the layouts, navigation, and course data were working correctly.

### Member 4: Reem Nassif


## Mock Data Explanation 
- Responsible for: Creating mock data for users, courses, modules, and lessons.
- Users:
   - Includes students and instructors with unique IDs, names, emails, roles, and avatars.
   - Tracks enrolled courses, created courses (for instructors), progress in courses, and join dates.
- Lessons:
   - Each lesson has an ID, title, content description, duration (minutes), and a video URL.
   - Covers programming, web development, design, math, and language topics.
- Courses:
   - Each course includes ID, title, short and full descriptions, instructor, category, difficulty, image, duration, rating, student count, and associated modules.
   - Designed to support course listing, filtering, searching, and detailed views.
- Modules:
   - Modules group lessons together, with a unique ID, title, order, and a list of lesson IDs.
   - Examples: JavaScript Fundamentals, React Introduction, CSS Mastery, Node.js Basics, Math Foundations, English Basics.
- Purpose:
   - Provides structured, realistic data for testing and development of CourseCard, CourseDetails, Courses pages, and module/lesson functionality.