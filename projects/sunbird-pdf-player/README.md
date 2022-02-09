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
Click to see the mock - [playerConfig](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.5.0/src/app/data.ts)

## Preview object
```js
var previewObj = {
  "context": {
    "mode": "play",
    "authToken": "",
    "sid": "7283cf2e-d215-9944-b0c5-269489c6fa56",
    "did": "3c0a3724311fe944dec5df559cc4e006",
    "uid": "anonymous",
    "channel": "505c7c48ac6dc1edc9b08f21db5a571d",
    "pdata": {
      "id": "sunbird.portal",
      "ver": "3.2.12",
      "pid": "sunbird-portal.contentplayer"
    },
    "contextRollup": {
      "l1": "505c7c48ac6dc1edc9b08f21db5a571d"
    },
    "tags": [
      ""
    ],
    "cdata": [],
    "timeDiff": 0,
    "objectRollup": {},
    "host": "",
    "endpoint": "",
    "userData": {
      "firstName": "",
      "lastName": ""
    }
  },
  "config": {
    "toolBar": {
      "showZoomButtons": false,
      "showPagesButton": false,
      "showPagingButtons": false,
      "showSearchButton": false,
      "showRotateButton": false
    },
    "sideMenu": {
      "showShare": true,
      "showDownload": true,
      "showReplay": true,
      "showExit": false,
      "showPrint": true
    }
  },
  "metadata": {},
  "data": ""
} 

```
## Description
|Property Name| Description| Default Value
|--|----------------------|--|
| `context` | It is an `object` it contains the `uid`,`did`,`sid`,`mode` etc., these will be logged inside the telemetry  | ```{}``` |
| `config` | It is an `object` it contains the `toolBar`,`sideMenu` etc., these will be used to configure the canvas  | ```{ toolBar: {"showZoomButtons": false,"showPagingButtons": false,"showSearchButton": false,"showRotateButton": false }, sideMenu: {"showShare": true, "showDownload": true, "showReplay": true, "showPrint": true}}``` |
| `mode` | It is an `string` to identify preview used by the user to play/edit/preview | ```play```|
| `authToken` | It is an `string` and Auth key to make  api calls | ```''```|
| `sid` | It is an `string` and User sessionid on portal or mobile | ```''```|
| `did` | It is an `string` and Unique id to identify the device or browser| ```''```|
| `uid` | It is an `string` and Current logged in user id| ```''```|
| `channel` | It is `string` which defines channel identifier to know which channel is currently using.| `in.ekstep` |
| `pdata` | It is an `object` which defines the producer information it should have identifier and version and canvas will log in the telemetry| ```{'id':'in.ekstep', 'ver':'1.0'}```|
| `contextRollup` | It is an `object` which defines content roll up data | ```{}```|
| `tags` | It is an `array` which defines the tag data | ```[]```|
| `objectRollup` | It is an `object` which defines object rollup data | ```{}```|
| `host` | It is a `string` which defines the from which domain content should be load|```window.location.origin```  |
| `userData` | It is an `object` which defines user data | ```{}```|
| `cdata` | It is an `array` which defines the correlation data | ```[]```|
| `metadata` | It is an `object` which defines content metadata json object (from API response take -> response.result.content) | ```{}```|
| `data` | It is an `object` which defines content body json object (from API response take -> response.result.content.body)| ```{}```|


## Available components
|Feature| Notes| Selector|Code|Input|Output
|--|--|--|------------------------------------------------------------------------------------------|---|--|
| PDF Player | Can be used to render pdf | sunbird-pdf-player| *`<sunbird-pdf-player [playerConfig]="playerConfig"><sunbird-pdf-player>`*|playerConfig|playerEvent, telemetryEvent|

## Use as web components	

Any web application can use this library as a web component. It accepts couple of inputs and triggers some events back to the application.

Follow below-mentioned steps to use it in plain javascript project:

- Insert [library](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.5.0/web-component/sunbird-pdf-player.js) as below:
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
- Refer demo [example](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.5.0/web-component/index.html)

- To run the project, use the following command:
	```bash
	npm run build-web-component
	http-server --cors web-component .
	```
	open [http://127.0.0.1:8081/web-component/](http://127.0.0.1:8081/web-component/)
	**Note:** There are some request for which we need to run this on server, so we need to run this on server for demo purpose we are using [http-server](https://www.npmjs.com/package/http-server).

- ![demo](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.5.0/web-component/pdf-player-wc.png)