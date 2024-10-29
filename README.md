# PlatePal Frontend

This project is the frontend for **PlatePal**, a delivery and takeaway management system designed for restaurants. PlatePal enables managers and employees to manage operations efficiently, including tracking orders, handling payments, managing employee shifts, and more. This frontend application is built with **React**, **Redux Toolkit**, and **TypeScript**.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TypeScript template.

## Features

- **Role-Based Views**: Managers have access to manage employees, inventory, and customer orders, while employees can log shifts, take orders, and process payments.
- **Order Creation and Tracking**: Easily search and view item descriptions, add orders, and track order status.
- **Shift Management**: Employees can clock in and out to track work hours.
- **Management Board**: A centralized dashboard for managers to control and manage all aspects of the app, similar to Django Admin but tailored specifically for restaurant operations in PlatePal.
- **PayPal Integration**: Customers can pay by cash or credit through PayPal.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits, and you will see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production in the `build` folder.\
The build is optimized and minified for the best performance, ready for deployment.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you need more control over the build and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project, giving you direct access to all configuration files.

## Deployment

To deploy on Netlify, follow these steps:

1. Link your Git repository to Netlify.
2. Use npm run build as the build command and build as the publish directory.
3. Configure the environment variables (API URL and PayPal Client ID) on Netlify as needed.

## Learn More

This frontend is a **React/Redux/TypeScript** app. You can learn more about the core technologies used in this project:

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Redux documentation](https://redux.js.org/)
- [Redux Toolkit documentation](https://redux-toolkit.js.org/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
