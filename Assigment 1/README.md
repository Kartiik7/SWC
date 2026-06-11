# CineVerse | Movie Ticket Booking Platform

CineVerse is a fully navigable, frontend-only React.js application representing a modern movie ticket booking platform. It simulates real-world interaction workflows across three key user roles: **Customer**, **Theatre Owner**, and **System Administrator**.

It features a responsive, premium glassmorphism dark mode UI styled with Tailwind CSS, utilizing React Router DOM for page navigation, Context API for shared state management, and Recharts for analytical data visualizations.

---

## 🌟 Key Features

### 1. Customer Module
- **Dashboard**: Modern dashboard with shortcuts, featured carousels, and upcoming release cards.
- **Unified Checkout Flow**: 
  - Location Select (Jaipur, Delhi, Mumbai, Bangalore, Hyderabad)
  - Theatre Select (Filters approved theatres screening the movie in that city)
  - Screen Select (IMAX, Dolby Atmos, Standard)
  - Showtime Selection (Morning, Afternoon, Evening, Night slots)
  - Seat Layout Selector (Premium, Gold, Silver seat pricing tiers)
  - Booking Summary (Detailed invoice breakdown with taxes & convenience fees)
  - Confirm Booking (Tick animations, receipt reference numbers)
- **Interactive Ticket**: Generates a mock printable ticket pass with barcode indicators.
- **Booking History**: Real-time log of active and past orders.
- **Profile & Settings**: Form updating and toggles for security, notifications, and dark modes.

### 2. Theatre Owner Module
- **Metrics Dashboard**: Stats showing total shows, tickets sold, and total revenue.
- **Sales Analytics**: Recharts Area Chart displaying real-time revenue trend lines.
- **Movie Catalog Management**: Add, update, or remove movie catalog listings.
- **Show Scheduling**: Multi-conditional scheduling linking movies, screens, timings, and ticket prices.
- **Screen Management**: Create auditoriums, projection types, and row capacities.
- **Seat Layout Creator**: Visually assign seat category bounds (Premium, Gold, Silver) to rows in a screen with active layout grids.

### 3. Administrator Module
- **Global Overview**: Counter widgets detailing gross platform revenue, active cinemas, and user counts.
- **Platform Analytics**: Bar Chart tracking platform ticket volume and gross transaction values.
- **User Auditing**: Table listing users with features to block/unblock or delete accounts.
- **Cinemas Management**: Verify active cinemas or update descriptions.
- **Approvals Queue**: Approve or reject pending owner cinema registry requests.
- **Analytics Reports**: Comprehensive box office tables and category occupancy charts.

---

## 📂 Project Directory Structure

```
src/
├── assets/             # Branding icons, images
├── components/         # Reusable UI components
│   ├── common/         # Buttons, Inputs, Tables, Modals, Loaders, Navbar, Sidebar
│   ├── movie/          # MovieCard
│   ├── booking/        # TheatreCard, Seat, SeatGrid
│   └── dashboard/      # DashboardCard, ProfileCard
├── pages/              # Portal views
│   ├── auth/           # Login, Signup
│   ├── user/           # User dashboard, Checkout stages, History, Settings
│   ├── owner/          # Owner dashboard, Movie form, Shows, Seat Configurator
│   └── admin/          # Admin dashboard, Users grid, Approvals queue, Reports
├── layouts/            # Page layouts (UserLayout, OwnerLayout, AdminLayout, AuthLayout)
├── routes/             # App routing and ProtectedRoute wrappers
├── context/            # Global contexts (AuthContext, MovieContext, BookingContext)
├── services/           # localStorage APIs syncing state
├── data/               # Mock datasets JSON files (Movies, Theatres, Bookings, Users)
├── hooks/              # Custom context shortcuts (useAuth, useMovie, useBooking)
├── utils/              # ID generation, date formatting
├── App.jsx             # Routes wrapper and contexts hookups
└── main.jsx            # Entry mount point
```

---

## 🔑 Mock Credentials (Quick Login)

All mock passwords are `password123`.

| Role | Username / Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer / User** | `user@cineverse.com` | `password123` | Ticket booking flow, history, settings |
| **Theatre Owner** | `owner@cineverse.com` | `password123` | Show schedulers, screen capacities, sales charts |
| **System Admin** | `admin@cineverse.com` | `password123` | Global user audits, cinema approvals, metrics |

---

## 🚀 Installation & Local Launch

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### Steps
1. **Clone the Repository** (or navigate to workspace directory):
   ```bash
   cd "d:/SWC/Assigment 1"
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
4. **Access CineVerse**:
   Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 📈 Future Backend Integration Plan

To transition CineVerse into a production-grade full-stack product, the following backend architecture is proposed:

### 1. Database Schema Design (SQL/PostgreSQL)
- **Users**: `id`, `name`, `email`, `password_hash`, `role (ENUM)`, `status (ENUM)`, `phone`, `address`, `created_at`.
- **Movies**: `id`, `name`, `synopsis`, `genre (VARCHAR[])`, `rating`, `votes_count`, `duration_mins`, `language`, `release_date`, `poster_url`, `banner_url`.
- **Theatres**: `id`, `name`, `city`, `address`, `owner_id (FK Users)`, `status (ENUM: Pending, Approved)`, `facilities (VARCHAR[])`.
- **Screens**: `id`, `theatre_id (FK)`, `name`, `type (IMAX/Dolby)`, `rows (VARCHAR[])`, `columns`, `premium_rows`, `gold_rows`, `silver_rows`.
- **Shows**: `id`, `movie_id (FK)`, `theatre_id (FK)`, `screen_id (FK)`, `date`, `time`, `price`.
- **Bookings**: `id`, `show_id (FK)`, `user_id (FK)`, `seats (VARCHAR[])`, `amount`, `status (ENUM)`, `payment_ref`, `created_at`.

### 2. API Endpoints (Node.js/Express)
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- **Customer**: 
  - `GET /api/movies` (with query filtering & search), `GET /api/movies/:id`
  - `GET /api/theatres?city=Jaipur`
  - `GET /api/shows?movieId=m1&theatreId=t1`
  - `POST /api/bookings` (Transactions utilizing SQL constraints for double-booking checks)
- **Owner**:
  - `POST /api/movies`, `PUT /api/movies/:id`, `DELETE /api/movies/:id`
  - `POST /api/shows`, `GET /api/owner/analytics`
- **Admin**:
  - `GET /api/admin/users`, `PUT /api/admin/users/:id/status` (block/unblock)
  - `GET /api/admin/theatres/pending`, `PUT /api/admin/theatres/:id/approve`

### 3. Concurrency & Seat Locking (Redis)
- To prevent multiple customers from paying for the same seats, introduce a **Redis-based distributed lock** (TTL of 5-10 minutes) when a user enters the Seat Selection checkout page.
- Implement transactional checks in database layers (e.g. PostgreSQL `SELECT ... FOR UPDATE`) during seat purchase commitments.
