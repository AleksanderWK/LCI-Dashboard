# Frontend

This is the frontend part of the application. It lets the user create learning sessions, visualizes the data from the sessions in a dashboard and has options to record each session and view the recorded data afterwards.

## Prerequisites

To run the program, the following is required:

- [Node.JS](https://nodejs.org/en/download/) 
- [Yarn](https://yarnpkg.com/getting-started/install)

## Installation

The frontend consists of a React application and an Electron application. Both must be installed separately.

1. Navigate to `frontend/` (this folder) and install all Electron dependencies:

    ```bash
    yarn install
    ```

2. Navigate to `frontend/app/` and install all React dependencies dependencies:

    ```bash
    yarn install
    ```

## Run the Program
When running the program, make sure to always start the React application first, because the Electron application is dependent on it.
Both must be running in their own terminal at the same time.

1. Navigate to `frontend/app` and start the React application:

    ```bash
    yarn start
    ```

2. Navigate to `frontend/` and start the Electron application:

    ```bash
    yarn start
    ```
