# Frontend - React Authentication UI

React-based frontend with routing, authentication context, and role-based access control.

## 📋 Quick Start

### 1. Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Application runs at: http://localhost:3000 (or http://localhost:5173 with Vite)

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   └── ProtectedRoute.jsx    # Route protection
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── pages/            # Page components
│   │   ├── LoginPage.jsx
│   │   ├── ConfigPage.jsx
│   │   ├── EditorPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── UnauthorizedPage.jsx
│   ├── styles/           # CSS files
│   ├── utils/
│   │   └── api.js        # Axios instance
│   ├── App.jsx           # Main app
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies
└── vite.config.js        # Build config
```

## 🔐 Authentication

### Login Flow

1. User enters credentials on `/login`
2. Frontend calls `POST /api/auth/login`
3. Token and user data stored in localStorage
4. User redirected based on role:
   - Admin → `/config`
   - User → `/editor`

### Using Auth in Components

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }
  
  return (
    <div>
      Welcome, {user.username}! ({user.role})
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 📍 Routes

| Route | Role Required | Component |
|-------|---------------|-----------|
| `/login` | None | Login page |
| `/config` | admin | Configuration |
| `/editor` | any user | Query editor |
| `/reports` | any user | Reports |
| `/unauthorized` | authenticated | Access denied |

### Route Protection

```jsx
// Require any authentication
<ProtectedRoute>
  <EditorPage />
</ProtectedRoute>

// Require admin role
<AdminRoute>
  <ConfigPage />
</AdminRoute>

// Require user role
<UserRoute>
  <EditorPage />
</UserRoute>
```

## 🌐 API Integration

### Axios Configuration

Located in `src/utils/api.js`:

```javascript
// Automatically adds token to headers
const api = axios.create({
  baseURL: 'http://localhost:8000'
});

// Usage
const response = await api.post('/api/auth/login', credentials);
```

### Making Requests

```javascript
import api from '../utils/api';

// With authentication (token auto-added)
const response = await api.get('/api/auth/me');

// The token is automatically included in all requests
```

## 📝 Page Components

### LoginPage (`src/pages/LoginPage.jsx`)

- Username and password input fields
- Form validation
- Error message display
- Demo credentials shown
- API integration with error handling
- Role-based redirect

### ConfigPage (`src/pages/ConfigPage.jsx`)

- Admin-only access
- Database connection form
- Navigation and logout

### EditorPage (`src/pages/EditorPage.jsx`)

- SQL query textarea
- Query execution button
- Results table display
- Navigation and logout

### ReportsPage (`src/pages/ReportsPage.jsx`)

- Report cards with descriptions
- View report buttons
- Navigation and logout

## 🧠 State Management

### AuthContext

Manages authentication state globally:

```jsx
{
  isAuthenticated: boolean,
  user: {
    id: number,
    username: string,
    email: string,
    role: string,
    is_active: boolean,
    created_at: string
  },
  token: string,
  loading: boolean,
  login: (token, user) => void,
  logout: () => void
}
```

### Usage

```jsx
import { useAuth } from '../context/AuthContext';

function Component() {
  const { user, logout } = useAuth();
  return <div>{user?.username}</div>;
}
```

## 🎨 Styling

Modern, gradient-based design with:
- Responsive grid layouts
- Smooth animations
- Accessibility considerations
- Mobile-friendly

Color Scheme:
- Primary: #667eea → #764ba2 (purple gradient)
- Background: #f5f5f5 (light gray)
- Text: #333 (dark gray)

## ⚙️ Configuration

Edit `.env` to configure:

```
VITE_API_BASE_URL=http://localhost:8000
```

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI library |
| react-dom | 18.2.0 | React rendering |
| react-router-dom | 6.20.0 | Routing |
| axios | 1.6.2 | HTTP client |

## 🚀 Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/` directory

### Preview Build

```bash
npm run preview
```

Test production build locally

## 🧪 Testing Login

### Demo Credentials

```
Admin:
  Username: admin
  Password: admin123

User:
  Username: user1
  Password: pass123
```

### Test Cases

1. **Successful Login (Admin)**
   - Enter: admin / admin123
   - Expected: Redirect to /config

2. **Successful Login (User)**
   - Enter: user1 / pass123
   - Expected: Redirect to /editor

3. **Invalid Credentials**
   - Enter: wrong / wrong
   - Expected: Error message displayed

4. **Protected Route Access**
   - Logged in as user, try accessing /config
   - Expected: Redirect to /unauthorized

## 💡 Tips

- Token automatically added to all API requests
- Invalid/expired token triggers automatic logout
- LocalStorage persists auth state across sessions
- Environment variables prefixed with `VITE_` are accessible

## 🐛 Common Issues

**CORS errors:**
- Backend CORS not configured for frontend URL
- Check server logs for details

**Login fails:**
- Backend not running
- Wrong API URL in `.env`
- Invalid credentials

**Blank page:**
- Check browser console (F12)
- Verify `npm install` was run
- Clear browser cache

## 📚 Further Reading

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Vite Guide](https://vitejs.dev/)

## 🎯 Best Practices Implemented

- ✅ Secure token storage
- ✅ Protected routes
- ✅ Context API for state management
- ✅ Custom hooks (`useAuth()`)
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Clean component structure
