# Event Hall Project

This project is a web application for an event hall booking system.

## Technologies Used

This project is built with:

-   Vite
-   TypeScript
-   React
-   shadcn-ui
-   Tailwind CSS
-   Supabase

## Getting Started

Follow these steps to get the project running locally:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd <YOUR_PROJECT_NAME>
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```
    or if you use bun:
    ```sh
    bun install
    ```

4.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL="your-supabase-url"
    VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```

5.  **Start the development server:**
    ```sh
    npm run dev
    ```
    or if you use bun:
    ```sh
    bun run dev
    ```

The application should now be running on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is busy).