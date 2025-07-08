# FleetFox Backend

This is the backend server for the FleetFox fleet management application.

## Setup Instructions

### 1. Environment Configuration

1. Copy the environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=fleetfox_db
   ```

### 2. Database Setup

1. **Start XAMPP**:
   - Open XAMPP Control Panel
   - Start MySQL service
   - Start Apache service (optional, for phpMyAdmin)

2. **Create Database** (optional - will be created automatically):
   - Go to http://localhost/phpmyadmin
   - Create a new database named `fleetfox_db`

### 3. Running the Backend

#### Development Mode (with auto-restart):
```bash
npm run server
```

#### Production Mode:
```bash
npm run server:start
```

#### Run Both Frontend and Backend:
```bash
npm run dev
```

### 4. API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

#### Test Endpoint
- `GET /api/test` - Test if server is running

### 5. Database Tables

The following tables will be created automatically:

- **users** - User accounts and authentication
- **vehicles** - Fleet vehicle information
- **staff** - Staff/employee records
- **logbook_entries** - Vehicle log entries
- **schedules** - Maintenance and scheduling
- **fuel_predictions** - Fuel consumption predictions
- **reports** - Generated reports

### 6. Default Admin User

To create a default admin user, you can use the registration endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@fleetfox.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 7. Troubleshooting

#### Database Connection Issues:
1. Make sure XAMPP MySQL service is running
2. Check your `.env` file credentials
3. Verify MySQL is accessible on port 3306

#### Port Already in Use:
- Change the PORT in `.env` file
- Or kill the process using the port

#### Module Not Found Errors:
- Run `npm install` to install dependencies
- Make sure all required packages are installed

### 8. Development Notes

- The server runs on port 5000 by default
- CORS is enabled for localhost:3000 (React frontend)
- JWT tokens expire in 24 hours by default
- Database connection uses connection pooling for better performance 