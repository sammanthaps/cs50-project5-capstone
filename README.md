# Capstone - CS50'S Web Programming with Python and JavaScript

## Description

This final project consists in a note-taking app, designed and implemented using Django with JWT Authentication and React as a JavaScript framework. The authenticated user will be able to create boards with tasks or notebooks with subjects and pages.

Each board has a main title that can be updated by the user. It also has options to create, update e delete tasks. All tasks can be also marked as completed.Boards are sorted based on the last update, but pinned boards come first. The user can only pin 3 boards and 3 books.

Similarly, all the notebooks, subjects and pages can also be create, updated and/or deleted by the user. The pages’ title will be the first 25 characters written within the file. The user can take advantage of _Markdown_ to write their pages. A preview will be showed when the edit mode is off, which is when the user clicks outside the text area.

Last but not least, all pinned items will also be displayed on the home page.

## Distinctiveness and Complexity

This project use **expanded** concepts of previous projects implemented throughout this course, such as the use of Markdown parser, React with Json Web Token authentication provided by Django REST Framework Simple JWT and Docker.

This project is also mobile responsible as per requirements.

There are two main sections used in the development of this project, each one is responsible for a portion of the website, for example, React will be used for user interaction and user experience whereas Django will be used for system components.

- **Backend**
  - `models.py`: All the models for this project will be found here. The are 6 models in this section:
    - `User`
    - `Board`
    - `Tasks`
    - `Notebook`
    - `Subject`
    - `Pages`
  - `serializers.py`: 2 classes will be found here:
    - `LoginSerializer`: For user authentication.
    - `RegisterSerializer`: For user register.
  - `views.py`: In this file you’ll find all the system functions such as Login, Register, Settings, Home Page, Boards, Task, Notebooks, Subjects and Pages.
- **Frontend**
  - `AuthService.js`: This file contains all the functions related with authentication using Json Web Tokens, such as Login, Logout and Register. This file is responsible for protecting against unauthenticated users and refreshing the authorization in an interval of 7 hours.
  - `Components.jsx`: Some functions will be used multiple times; therefore, they were turned in components so they become reusable.
  - `Authentication.jsx`: User Login and Register forms are located here.
  - `Index.jsx`: The base structure of the project.
  - `Workspace.jsx`: Contains the home page, where all the pinned boards and books are shown.
  - `Boards.jsx`: All the functions related to boards and tasks are in this file.
  - `Notebooks.jsx`: Notebook, Subject and Page’s functions are located here.
  - `Settings.jsx`: This file contains all the functions to edit a user profile.

This project is not similar to any previous projects implemented through this course; therefore, it satisfies the distinctiveness and complexity requirements.

## How to run

In order to run this project, you have got to have Docker installed in your machine, so it will be able to install all the requirements.
You can find their official documentation here: <https://docs.docker.com/desktop/>

- **Step 1**: Go to the project _main_ folder and in your bash terminal: `docker compose up`
- **Step 2**: In your _browser_ go to: `http://127.0.0.1:8000`

If you want to see a demonstration of this project functionality: <https://youtu.be/hz_p7JzQ_Rk>
