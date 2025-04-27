# User Management App

> **Note:**  
> This project combines a simple Node.js backend and an Angular frontend.  
> Below are the instructions to get the development environment up and running, a summary of the endpoints, the libraries used, and a brief note on tests.



## Installation

   ```bash
   npm install
   ```

## Development

To start both the backend and frontend in development mode with a single command:

```bash
npm run dev
```

This uses the `concurrently` package to launch:

- **Node.js Server**  
  - Runs on `http://localhost:3000` by default.  
  - Uses a local file (e.g., `src/server/users.json`) as a mock database.
  - **Endpoints**:  
    - `GET /users` — fetch all users  
    - `POST /users/:id` — update a specific user

- **Angular App**  
  - Served on `http://localhost:4200` by default.  
  - Connects to the backend API endpoints above.

## Project Structure

```
/src/server      # Node.js server code and mock database file
/src/app         # Angular application source code
```

## Libraries & Tools

- **Angular** (latest)  
- **Tailwind CSS** for styling  
- **RxJS** for reactive programming  
- **NgRx Signal Store** for state management  
- **Concurrently** to run server & client together

## Testing

I have included basic unit tests covering:
- Component initialization and method logic  
- Service HTTP request functionality  

Hope this is enough :)
