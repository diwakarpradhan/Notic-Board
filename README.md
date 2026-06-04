# Notice Board Application

A full-stack web application for managing notice board announcements with create, read, update, and delete (CRUD) operations.

## Features

- **Create Notices**: Add new notices with title, body, category, priority, publish date, and optional images
- **Read Notices**: View all notices in a responsive grid layout on both desktop and mobile
- **Update Notices**: Edit existing notices with pre-filled form values
- **Delete Notices**: Remove notices with confirmation dialog to prevent accidental deletion
- **Priority Sorting**: Urgent notices automatically appear first in the list with a red badge
- **Category System**: Organize notices by category (Exam, Event, General)
- **Server-side Validation**: Input validation happens on the server to ensure data integrity
- **Responsive Design**: Works seamlessly on phones and desktop devices
- **Persistent Storage**: All notices are saved in a hosted database and persist across refreshes

## Tech Stack

- **Framework**: Next.js 14 with Pages Router
- **Database ORM**: Prisma
- **Database**: SQLite (can be upgraded to PostgreSQL, MySQL, etc.)
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **Frontend State**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A code editor (VS Code recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notice-board
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev --name init
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
notice-board/
├── src/
│   ├── pages/
│   │   ├── _app.tsx              # App wrapper with global styles
│   │   ├── _document.tsx         # Document structure
│   │   ├── index.tsx             # Notices list page
│   │   ├── api/
│   │   │   ├── notices.ts        # GET all, POST create
│   │   │   └── notices/[id].ts   # GET one, PUT update, DELETE
│   │   └── notices/
│   │       ├── new.tsx           # Create notice page
│   │       └── [id]/edit.tsx     # Edit notice page
│   ├── components/
│   │   └── NoticeForm.tsx        # Reusable form component
│   └── index.css                 # Tailwind styles
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
└── README.md
```

## API Routes

### GET /api/notices
Retrieves all notices ordered by priority (Urgent first) and then by publish date.

**Response**: Array of notices

### POST /api/notices
Creates a new notice.

**Request body**:
```json
{
  "title": "string",
  "body": "string",
  "category": "Exam|Event|General",
  "priority": "Normal|Urgent",
  "publishDate": "ISO date string",
  "image": "URL (optional)"
}
```

**Validation**: All required fields must be non-empty and date must be valid.

### GET /api/notices/[id]
Retrieves a specific notice by ID.

### PUT /api/notices/[id]
Updates a specific notice.

**Request body**: Same as POST /api/notices

### DELETE /api/notices/[id]
Deletes a specific notice.

## Key Features Implemented

### Server-side Validation
All form inputs are validated on the server in the API routes, not just in the browser. This includes:
- Required fields cannot be empty (title, body, publishDate)
- Date format validation
- Proper HTTP status codes (400 for validation errors, 404 for not found, etc.)

### Priority Ordering
The priority ordering is handled in the Prisma database query using `orderBy`, not in the browser:
```prisma
orderBy: [
  { priority: 'desc' },  // Urgent first
  { publishDate: 'desc' }
]
```

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Grid layout adapts from 1 column (mobile) to 3 columns (desktop)
- Proper touch targets and spacing for mobile devices

### Delete Confirmation
Users must confirm deletion through a modal dialog to prevent accidental data loss.

## What I Would Improve With More Time

1. **Image Upload**: Currently accepts image URLs only. With more time, I'd implement direct file uploads to a cloud storage service like AWS S3 or Cloudinary.

2. **Search & Filter**: Add search functionality and advanced filtering by category, priority, and date range to help users find notices quickly.

3. **Pagination**: For large numbers of notices, implement pagination to improve performance and user experience.

4. **User Authentication**: Add login system with role-based access (admin can create/edit all, users can only view).

5. **Rich Text Editor**: Replace textarea with a rich text editor (like Tiptap or Quill) for better formatting options.

6. **Email Notifications**: Send email alerts when new notices are posted, especially for Urgent ones.

7. **Database Optimization**: Add indexes on frequently queried columns like priority, category, and publishDate.

8. **Testing**: Add comprehensive unit and integration tests to ensure reliability.

9. **Dark Mode**: Implement a dark theme toggle for better user experience at night.

10. **Analytics**: Track notice views and engagement metrics.

## How AI Was Used

AI was used as an assistant throughout this project to:

1. **Code Generation**: Generated the initial structure for API routes, React components, and database schema based on requirements.

2. **Component Development**: Created the notice form component that works for both create and edit modes without duplication.

3. **Error Handling**: Helped design robust error handling patterns for API routes and validation.

4. **UI/UX Design**: Provided suggestions for responsive design patterns and accessibility improvements.

5. **Debugging**: Assisted in resolving configuration issues with Next.js, Prisma, and Tailwind CSS setup.

6. **Documentation**: Helped write clear README documentation and code comments.

However, all code was reviewed, understood, and validated by the developer before implementation. Key business logic and validation rules were implemented according to the specification.

## Deployment

To deploy on Vercel:

1. Push your code to a public GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a Next.js project
4. Set environment variables for DATABASE_URL
5. Deploy!

The application is now live and ready for production use.
