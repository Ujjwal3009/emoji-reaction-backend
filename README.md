# Real-Time Emoji Reactions WebSocket Server

This project is a WebSocket server built with Node.js, Express, and Socket.io, designed for real-time emoji reactions in a cricket-based event system. The server allows clients to send and receive emoji reactions in real-time, making it suitable for interactive applications.

## Features

- Real-time broadcasting of emoji reactions to all connected clients.
- Event-based messaging using Socket.io.
- CORS support for frontend connections.
- Simple and scalable architecture with separate files for server and socket management.

## Tech Stack

- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for Node.js.
- **Socket.io**: Library for real-time web applications.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.

## Project Structure

- `src/server.ts`: Main server file with Socket.io setup.
- `src/socket.ts`: Socket.io event handlers.
- `src/types.ts`: TypeScript type definitions.
- `src/utils.ts`: Utility functions.

## Installation

1. Clone the repository:



2. Install dependencies:    
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

## Usage

1. Open the `index.html` file in your browser.
2. Enter an emoji in the input field and click the "Send Emoji" button to send it to the server.
3. The emoji will be broadcasted to all connected clients.

## Contributing

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

                    




