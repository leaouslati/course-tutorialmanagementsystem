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

### Homepage in Light Mode
![Homepage in Light Mode](./screenshots/homepage-light-mode.png)

### Homepage in Dark Mode
![Homepage in Dark Mode](./screenshots/homepage-dark-mode.png)

### Course page filterng searching and checking courses
![Course Page](./screenshots/Course-page.png)

### Enrollments page
![Enrollments page](./screenshots/Enrollments-page.png)

### Profile page
![Profile page](./screenshots/ProfilePage.png)

### Navbar before logging in 
![Navbar](./screenshots/Navbar.png)

### Navbar after logging in
![Navbar after](./screenshots/-Navbar-.png)

### Login Page
![Login page](./screenshots/login-page.png)

### Sign-up Page
![Sign-up page](./screenshots/Sign-up-page.png)

### Manage Courses Page
![Manage Courses Page](./screenshots/ManageCourses-page.png)

### Course Details Page
![Course Details page](./screenshots/CourseDetails-page.png)


## Team Member Contributions

### Member 1: Lea Ouslati
- Responsible for: Homepage & Login Page
- Contributions:
    - Set up React Router to manage navigation between different pages of the application.

    - Designed and implemented the Homepage, including layout structure, featured courses section,   navigation links, and key platform statistics.

    - Developed the Login Page with form validation and integration with mock user data.

    - Implemented user authentication logic on the Login Page, including input validation, error handling, and redirecting users to the Homepage after successful login.
    
    - Managed and organized the GitHub repository, including creating branches, handling commits, and merging changes when needed to maintain a clean workflow.

### Member 2: Reem Antar 
- Responsible for: CourseCard, CourseDetails, and Courses pages
- Contributions:
   - Built the CourseCard component to showcase courses with key info like title, instructor, difficulty, duration, and ratings, including dynamic badges for new or recently updated courses.

   - Designed the CourseDetails page, allowing users to explore full course info, view modules and lessons, enroll in courses, and receive real-time notifications for actions.

   - Created the Courses page with search, filters, and sorting options. 

   - Filtering and searching include: users can filter by difficulty or category, search by course title, and sort by rating or duration making it simple to quickly find the course that fits their needs.

   - Defined and structured the modules dataset in mockdata.js

   - Chose the color palette and styling rules for these pages, ensuring a consistent and user-friendly interface across the website

### Member 3: Intissar Soulaiman
- Responsible for: Navbar, Profile Page, and Enrollments Page.
- Contributions:
   - Built the Navbar component and organized it inside the components folder, including the navigation menu, page links, and theme toggle button. Also updated it so the Enrollments link only appears when the user is logged in.
   - Designed and implemented the Profile Page with user information, quick actions, badges, ID card modal, and edit profile modal. Added responsive layouts so the page works well on mobile, tablet, and desktop screens.
   - Developed the Enrollments Page to display each student’s enrolled courses with progress bars, course status, module and lesson counts, and continue actions. Also added unenroll confirmation handling and responsive card layouts
   - Expanded and structured the mock data in mockdata.js by adding more courses, users, lessons, and modules, with different progress values to make testing more realistic and to support dynamic rendering across the app.
   - Continuously tested the pages during development to make sure the layouts, navigation, and course data were working correctly.

### Member 4: Reem Nassif
- Responsible for: Register Page & Manage Courses Page
- Contributions:
   - Designed and implemented the user registration form with input validation and role selection.
   - Integrated authentication logic with automatic login and navigation after successful registration.
   - Developed the Manage Courses page with full CRUD functionality (add, edit, delete courses).
   - Implemented search and dynamic updates to manage courses efficiently within the interface. 
   - Integrated advanced features such as user authentication, role management, and dynamic course handling.

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