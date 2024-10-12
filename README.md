# Scrum Voting Application

This is a **Scrum card voting** application where participants can vote on task sizes (XXS to XXL). The backend is implemented using **Go** with the **Echo framework**, and the frontend uses **React TypeScript**. Votes are submitted in real-time and synchronized across clients.

## Features

- Voting on task sizes using Scrum cards (XXS, XS, S, M, L, XL, XXL)
- Real-time updates across clients using WebSockets
- Task list saving: saves the task name and the selected size after voting and can be exported as xlsx(excel) file to make Scrum Master's work easier

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Contributing](#contributing)


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/selcukatav/scrum-point.git
    cd scrum-voting-app
    ```

2. Install dependencies for both the backend and frontend:

    - Backend (Go):

      ```bash
      cd ./server
      go mod tidy
      ```

    - Frontend (React):

      ```bash
      cd ./client/scrum-point
      npm install
      ```

3. Start the backend:

    ```bash
    go run main.go
    ```

4. Start the frontend:

    ```bash
    npm run dev
    ```

## Usage

Once both backend and frontend are running:

1. Open your browser and navigate to `http://localhost:5173`.
2. Join the voting session via the provided link and share the link with your team.
3. Vote on Scrum card sizes.
4. The results will be revealed once the 'Show Votes' button is pressed by one participant, and the results will be updated for all clients in real-time.
5. Save the task if you want to export to the excel file. 

## API Endpoints

- **POST** `/vote`: Submit a vote for a card.
  - Payload example:

    ```json
    {
      "size": "L",
      "clientId":"random-uuid"
    }
    ```
- **POST** `/create-session`: Creates unique session for use.

- **POST** `/export`: Exports the saved tasks with voted sizes to excel(xslx).
  - Payload example:

      ```json
      {
        "taskName": "example task name",
        "size": "M"    
      }
      ```

- **GET** `/join-session`: Makes other users join to the session that Master created.

 ```json
      {
        "sessionId": "random-session-uuid",
        "message": "Joined to the session",
            
      }
  ```

### WebSocket Endpoint

- **Endpoint**: `/ws/:sessionId`
- This WebSocket connection is established by the client to join a specific voting session. Each session is identified by a unique `sessionId`.

- **Example**: `ws://localhost:3000/ws/12345`

### WebSocket Message Types

The server handles several message types to manage different actions during the voting process. These are broadcast to all connected clients to ensure real-time synchronization.

1. **clear-votes**:  
   When a message of type `clear-votes` is received, the server clears all existing votes, resetting the voting session. This action broadcasts the reset state to all clients.
   
   - **Action**: Clears the votes and broadcasts a `clear` event to all clients with the updated state.

   - **Broadcast Message**:
     ```json
     {
       "type": "clear",
       "votes": {}
     }
     ```

2. **show-results**:  
   This message triggers the calculation of the most voted Scrum card and broadcasts the result to all clients. It highlights the most voted card and provides the full vote breakdown.

   - **Action**: Calculates the most voted card and broadcasts a `highlight` event to clients with the result.

   - **Broadcast Message**:
     ```json
     {
       "type": "highlight",
       "mostVotedCard": "L",
       "votes": {
         "M": 1,
         "L": 5,
         .
         .
       }
     }
     ```

3. **save-vote**:  
   After voting is completed, the `save-vote` message saves the most voted card and broadcasts this result to all clients.

   - **Action**: Saves the final vote and broadcasts a `save-vote` event to clients with the saved data.

   - **Broadcast Message**:
     ```json
     {
       "type": "save-vote",
       "taskName":"example name"
       "vote": "L"
     }
     ```


## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.


