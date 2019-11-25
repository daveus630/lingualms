# Lingualmsfrontend Project
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.8.

# Leave Tracker Project SetUp Steps:
1. Install Node.js and npm latest stable version.
2. Install Angular v6.1.0 CLI.
3. Install Visual Studio Code IDE latest version required to work on project code.
4. Download the `lingualmsfrontend` zipped project on your machine. Once the download done, extract the project to have `lingualmsfrontend` folder.
5. Open the folder in Visual Studio Code.
6. Run the command `git init` to initialise the git repository.
7. Run the command `npm install` to install all project dependencies. 
8. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
9. Run `npm run-script build` to build the project for the production deployment. The build artifacts will be stored in the `dist/` directory.
10. Once the `dist/` folder is generated, copy it to a `lms-cloud-hosting` project folder to deploy your front-end code on Google App engine.

# Leave Tracker Front-End Project Hosting Steps:
1. Download the `lms-cloud-hosting` zipped project on your machine. Once the download done, extract the project to have `lms-cloud-hosting` folder.
2. Open the folder using Visual Studio Code.
3. Download and install the `Google Cloud SDK` which provides the gcloud command-line tool.s
4. Run the command `npm install` to install all project dependencies.
5. Once done the project folder will have the shown structure (https://screenshot.googleplex.com/nHAjbyJPL5U.png).
6. Run `gcloud config set project lms-cloud-hosting` to set the project on Google Cloud for the deployment.
7. Run `gcloud app deploy` to deploy your front-end code on Google App engine.
8. Note: You need to replace `dist` folder each time you build your frontend code after changes. This is done to ensure latest stable code are deployed on Production.

# Leave Tracker Back-End Project Hosting Steps:
1. Download the `lingualms` zipped project on your machine. Once the download done, extract the project to have `lingualms` folder.
2. Open the folder using Visual Studio Code.
3. Download and install the `Google Cloud SDK` which provides the gcloud command-line tool. Perform this step only if no Cloud SDK installed earlier.
4. Run the command `npm install` to install all project dependencies.
5. Once done the project folder will have the shown structure (https://screenshot.googleplex.com/sVKurRgf7DH.png).
6. Run `gcloud config set project lingualms` to set the project on Google Cloud for the deployment. 
6. Run `gcloud app deploy` to deploy your back-end code on Google App engine.
7. Note: Since .env file won't be availabe outside IDE, we have renamed it to `abc.env`. You need to rename it to `.env` inside IDE before deploying your code locally or on server.
8. Note: Don't commit `.env` file to the repository as it contains secret keys and password. In order to ignore, add `.env` to `.gitignore` file before committing your first change to repository. 
