# Rental Manager

A modern, full-featured property management system built with React, TypeScript, and Supabase. Designed to help property managers and landlords efficiently manage their properties, tenants, and documents.

## Fork in bolt.new
[https://bolt.new/github/donvito/bolt-rental-manager](https://bolt.new/github/donvito/bolt-rental-manager)

## Screenshot
<img width="1721" alt="Screenshot 2025-02-18 at 9 34 12 PM" src="https://github.com/user-attachments/assets/afb59398-52b3-49b2-b51b-5985892b4170" />

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Router v6
  - Lucide React Icons

- **Backend**
  - Supabase
  - PostgreSQL
  - Row Level Security

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher
- npm or yarn
- A Supabase account

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rental-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Click "Connect to Supabase" in the top right of the project
   - Follow the setup instructions to connect your project

4. **Environment Variables**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   These environment variables are required for the application to function:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (found in Project Settings > API)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase project's anon/public key (found in Project Settings > API)
   
   > ⚠️ **Important**: Never commit your `.env` file to version control. Make sure it's included in your `.gitignore` file.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Visit `http://localhost:5173` in your browser

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── lib/              # Utilities and configurations
├── types/            # TypeScript type definitions
└── main.tsx          # Application entry point
```

## Key Components

- `AuthProvider`: Manages authentication state
- `ProtectedRoute`: Handles route protection
- `Dashboard`: Main overview page
- `Properties`: Property management
- `Tenants`: Tenant management
- `Documents`: Document management

## Database Schema

The application uses the following main tables:
- `properties`: Property information
- `tenants`: Tenant details
- `maintenance_requests`: Maintenance tracking
- `documents`: Document management

## Development

- **Running tests**
  ```bash
  npm run test
  ```

- **Building for production**
  ```bash
  npm run build
  ```

- **Linting**
  ```bash
  npm run lint
  ```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting service (e.g., Netlify, Vercel)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.
