# Pdf player library for Sunbird platform!
Contains PDF player library components powered by angular. These components are designed to be used in sunbird consumption platforms *(mobile app, web portal, offline desktop app)* to drive reusability, maintainability hence reducing the redundant development effort significantly.

# Getting Started
For help getting started with a new Angular app, check out the Angular CLI.
For existing apps, follow these steps to begin using .

## Step 1: Install the package

    npm install @project-sunbird/sunbird-pdf-player-v9 --save
    npm install @project-sunbird/sb-styles --save

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



## Available components
|Feature| Notes| Selector|Code|Input|Output
|--|--|--|------------------------------------------------------------------------------------------|---|--|
| PDF Player | Can be used to render pdf | sunbird-pdf-player| *`<sunbird-pdf-player><sunbird-pdf-player>`*|playerConfig|playerEvent, telemetryEvent|