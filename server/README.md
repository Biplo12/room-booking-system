# Conference Room Booking API

A Flask-based RESTful API for managing conference room bookings.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL database
- Virtual environment tool (optional but recommended)

## Installation

1. Clone the repository:

git clone [<repository-url>](https://github.com/Biplo12/room-booking-system)
cd server

2. Create and activate a virtual environment (optional):

# On Windows

python -m venv venv
venv\Scripts\activate

# On Unix or MacOS

python -m venv venv
source venv/bin/activate

3. Install dependencies:

pip install -r requirements.txt

4. Create a `.env` file in the server directory with the following variables:

SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET_KEY=your-secret-key

## Database Setup

Initialize the database:

flask db upgrade

## Running the Application

### Development Server

flask run

The API will be available at `http://localhost:5000`

## Running Tests

pytest

## API Documentation

### Authentication Endpoints

- POST `/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- POST `/auth/login` - Login and receive JWT token
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Conference Room Endpoints

- GET `/conference-rooms` - List all conference rooms
- POST `/conference-rooms` - Create a new conference room
  ```json
  {
    "name": "string",
    "capacity": "integer",
    "location": "string",
    "amenities": ["string"]
  }
  ```
- GET `/conference-rooms/<id>` - Get conference room details
- PUT `/conference-rooms/<id>` - Update conference room
- DELETE `/conference-rooms/<id>` - Delete conference room

Some endpoints require a valid JWT token in the Authorization header:

Authorization: Bearer <your-token>

## Project Structure

server/
├── app/
│ ├── **init**.py # Application factory and extensions
│ ├── config.py # Configuration settings
│ ├── models/ # Database models
│ ├── routes/ # API endpoints
│ │ ├── **init**.py
│ │ ├── auth_routes.py
│ │ └── conference_room_routes.py
├── tests/
│ ├── conftest.py # Test configurations and fixtures
│ └── unit/
│ ├── test_auth.py
│ └── test_conference_room.py
├── requirements.txt # Project dependencies
└── README.md

## Development

- Use `flask db migrate` to generate new migrations after model changes
- Use `flask db upgrade` to apply migrations
- Run tests before submitting pull requests

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Contributing

1. Create a new branch for your feature
2. Write tests for new functionality
3. Submit a pull request

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
