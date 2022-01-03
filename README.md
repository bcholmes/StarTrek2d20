# StarTrek2d20

This branch contains the code that supports the Star Trek Adventures code generator version found at
https://sta.bcholmes.org . This is an alternative (and possibly temporary) version of [the main character
generator app](https://sta.modiphiusapps.hostinguk.org/). Why does an alternative version exist? I wanted to 
make some additional features available a bit faster than it was taking to get pull requests processed (and
deployed) on the original codebase.

## Prerequisites
- Visual Studio 2019 (Community or higher) (optional) or Visual Studio Code (again, optional).
- NodeJS (v10.13.0 or higher).
- TypeScript 4.5

## Getting Started

### With Visual Studio

1. Open a command prompt in the WebTools/ folder and type ```npm install``` to install node modules.
2. Open the solution in Visual Studio.
3. Compile the project.

Compiling will use webpack to generate a master script in the dist/ folder.

### Without Visual Studio

1. Open a command prompt in the WebTools/ folder and type ```npm install``` to install node modules.
2. Start the development server using the ```npm run start``` command
3. Once the development server starts, it should automatically open http://localhost:3000 in your browser

## Building the Production Version

1. Open a command prompt in the WebTools/ folder and type ```npm install``` to install node modules.
2. Build the assets using the ```npm run build``` command

The build process creates a series of files in the WebTools/build folder. Upload the contents of the 
WebTools/build folder to a web server, and you're done.

## Contributing
Contributions are welcome. Use a PR to get your changes into the master branch.
