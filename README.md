# CourseHub

## Team Members:
- Lea Ouslati
- Reem Antar
- Intissar Souleiman
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

### Member 3: Intissar Souleiman

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