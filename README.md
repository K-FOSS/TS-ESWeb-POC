# K-FOSS/TS-ESWeb-POC

## VERY WORK IN PROGRESS

This is a proof of concept of using the TypeScript compiler API, my @K-FOSS/TS-ESNode module, and new Import maps for using ESModules and TypeScript in the browser with live transpile of TypeScript code.

## Development

### Setting up the development container

Follow these steps to open this project in a container:

1. If this is your first time using a development container, please follow the [getting started steps](https://aka.ms/vscode-remote/containers/getting-started).

2. To use this repository, you can either open the repository in an isolated Docker volume:

   - Press <kbd>F1</kbd> and select the **Remote-Containers: Open Repository in Container...** command.
   - Enter `K-FOSS/TS-ESWeb-POC`
   - The VS Code window (instance) will reload, clone the source code, and start building the dev container. A progress notification provides status updates.

   Or open a locally cloned copy of the code:

   - Clone this repository to your local filesystem.
     - `git clone https://github.com/K-FOSS/TS-ESWeb-POC.git`
   - Open the project folder in Visual Studio Code.
     - `code ./TS-ESWeb-POC`
   - Reopen in Container

     - When you open the project folder in Visual Studio Code you should be prompted with a notification asking if you would like to reopen in container.

     Or manually reopen

     - Press F1 and select the "Remote-Containers: Open Folder in Container..." command.

### Starting the Server

- Start the server
  - `npm run start`

### Testing

**MUST HAVE NODE.JS v14 or newer**

To try this out, clone repo

Install NPM modules

```
npm install
```

Run all tests

```
npm test
```

All tests are run on all commits and PRs.

### Style

This project currently uses Prettier for code styling and automatic formatting. Prettier is run on every commit and pull request.

Run Prettier

```
npm run prettier
```

### Linting

This project currently uses ESLint for code linting. ESLint is run on every commits and pull request.

Run ESLint

```
npm run lint
```

### Dependency Management

Dependency Management for this project is handled by automated pull requests created by [Dependabot](https://github.com/marketplace/dependabot-preview). When new released of development Dependencies are released Dependabot automatically creates a pull request for upgrading to the new version. If the created pull request passes the GitHub Actions testing, prettier/styling, and linting I will merge the pull request.
