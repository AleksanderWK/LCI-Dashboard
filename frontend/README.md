# Frontend

An application to create learning sessions for students to connect to, visualize the live data from the sessions in a dashboard, and record sessions to be able to view the data afterwards.

## Prerequisites

To run the program, the following is required:

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Installation

In the `frontend/` folder, install all dependencies with:

```
yarn run setup
```

## Run the Program

In the `frontend/` folder, start both the React and Electron application with:

```
yarn run dashboard
```

**Note**: You may have to refresh the Electron window when the React development server has started. Do this by pressing `Ctrl + R`.

## Run the Tests

In the `frontend/app/` folder, run the tests with:

```
yarn test --watchAll
```
