# Pdf player library for Sunbird platform!
Contains PDF player library components powered by angular. These components are designed to be used in sunbird consumption platforms *(mobile app, web portal, offline desktop app)* to drive reusability, maintainability hence reducing the redundant development effort significantly.

# Getting Started
For help getting started with a new Angular app, check out the Angular CLI.
For existing apps, follow these steps to begin using .

## Step 1: Install the packages
		```bash
    npm install @project-sunbird/sunbird-pdf-player-v9 --save
    npm install @project-sunbird/sb-styles --save
    npm install @project-sunbird/client-services --save
		```
## Step 2: Include the sb-styles and assets in angular.json
    "styles": [
    ...
    ...
    "./node_modules/@project-sunbird/sb-styles/assets/_styles.scss"
    ]
  Add following under architect.build.assets

     {
	    ...
	    "build": {
	    
	    "builder": "@angular-devkit/build-angular:browser",
	    
	    "options": {
		    ...
		    ...
    
		    "assets": [
		    
			   ...
			   ...
			    
			    {
				    "glob": "**/*.*",
				    "input": "./node_modules/@project-sunbird/sunbird-pdf-player-v9/lib/assets/",
				    "output": "/assets/"
			    }
		    
		    ],
    
	    "styles": [
	    
	    ...
	    
	    "./node_modules/@project-sunbird/sb-styles/assets/_styles.scss"
	    
	    ],
	    
	    ...
	    ...
    
    },

  

## Step 3: Import the modules and components
Import the NgModule where you want to use:
       
    import { SunbirdPdfPlayerModule } from '@project-sunbird/sunbird-pdf-player-v9';
    
    @NgModule({
	    ...
	    
	    imports: [SunbirdPdfPlayerModule],
	    
	    ...
    })

  
    export class TestAppModule { }

## Step 4: Send input to render PDF player

Use the mock config in your component to send input to PDF player
Click to see the mock - [playerConfig](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.4.0/src/app/data.ts)

## Available components
|Feature| Notes| Selector|Code|Input|Output
|--|--|--|------------------------------------------------------------------------------------------|---|--|
| PDF Player | Can be used to render pdf | sunbird-pdf-player| *`<sunbird-pdf-player [playerConfig]="playerConfig"><sunbird-pdf-player>`*|playerConfig|playerEvent, telemetryEvent|

## Use as web components	

Any web application can use this library as a web component. It accepts couple of inputs and triggers some events back to the application.

Follow below-mentioned steps to use it in plain javascript project:

- Insert [library](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.4.0/web-component/sunbird-pdf-player.js) as below:
	```javascript
	<script type="text/javascript" src="sunbird-pdf-player.js"></script>
	```
- Get sample playerConfig from here: [playerConfig](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.3.0/src/app/data.ts)

- Create a custom html element: `sunbird-pdf-player`
	```javascript
    const  pdfElement = document.createElement('sunbird-pdf-player');
   ```

- Pass data using `player-config`
	```javascript
	pdfElement.setAttribute('player-config', JSON.stringify(playerConfig));
	```

	**Note:** Attribute name should be in kebab-case regardless of the actual Attribute name used in the Angular app. The value of the attribute should be in **string** type, as web-component does not accept any objects or arrays.

- Listen for the output events: **playerEvent** and **telemetryEvent**

	```javascript
	pdfElement.addEventListener('playerEvent', (event) => {
		console.log("On playerEvent", event);
	});
	pdfElement.addEventListener('telemetryEvent', (event) => {
		console.log("On telemetryEvent", event);
	});
	```
- Append this element to existing element
	```javascript
	const  myPlayer = document.getElementById("my-player");
	myPlayer.appendChild(pdfPlayerElement);
	```
- Refer demo [example](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.4.0/web-component/index.html)

- To run the project, use the following command:
	```bash
	npm run build-web-component
	http-server --cors web-component .
	```
	open [http://127.0.0.1:8081/web-component/](http://127.0.0.1:8081/web-component/)
	**Note:** There are some request for which we need to run this on server, so we need to run this on server for demo purpose we are using [http-server](https://www.npmjs.com/package/http-server).

- ![demo](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.4.0/web-component/pdf-player-wc.png)