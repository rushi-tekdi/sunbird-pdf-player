# Pdf player library for Sunbird platform!
Contains PDF player library components powered by angular. These components are designed to be used in sunbird consumption platforms *(mobile app, web portal, offline desktop app)* to drive reusability, maintainability hence reducing the redundant development effort significantly.

# Getting Started with different integrations steps
 The pdf player can be integrated as web component in plain javascript projects and as web component in angular apps and also as angular library in angular and mobile applications.

# Use as web components	
Any web application can use this library as a web component. It accepts couple of inputs and triggers some events back to the application.

Follow below-mentioned steps to use it in plain javascript project:

- Insert [library](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.5.0/web-component/sunbird-pdf-player.js) as below:
	```javascript
	<script type="text/javascript" src="sunbird-pdf-player.js"></script>
	```
- Update below script in index.html file 
	```javascript
      <script src="https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect.min.js"
      integrity="sha512-jvbPH2TH5BSZumEfOJZn9IV+5bSwwN+qG4dvthYe3KCGC3/9HmxZ4phADbt9Pfcp+XSyyfc2vGZ/RMsSUZ9tbQ=="
      crossorigin="anonymous" referrerpolicy="no-referrer"></script>
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

# Use as Web component  in the Angular app

- Copy the assets files from web component folder
  [assets](https://github.com/project-sunbird/sunbird-pdf-player/tree/release-5.2.0/web-component/assets) to assets folder

- Create sunbird folder inside assets folder, and copy [sunbird-pdf-player.js](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-5.2.0/web-component/sunbird-pdf-player.js) and  [styles.css](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-5.2.0/web-component/styles.css). and Add/import these enteries in angular json file inside scripts and styles respectively.

- Add the reflect-metadata script to index.html file
	```javascript
      <script src="https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect.min.js"
      integrity="sha512-jvbPH2TH5BSZumEfOJZn9IV+5bSwwN+qG4dvthYe3KCGC3/9HmxZ4phADbt9Pfcp+XSyyfc2vGZ/RMsSUZ9tbQ=="
      crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	```

- Import reflect-metadata in main.ts file 

	```javascript
  import 'reflect-metadata';
	```

- Import  CUSTOM_ELEMENTS_SCHEMA in app module

	```javascript
  import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
	```

- Import  sunbird-pdf-player in component
    ```bash
    <sunbird-pdf-player  [playerConfig]="playerConfig" (playerEvent)="playerEvents($event)"
    (telemetryEvent)="playerTelemetryEvents($event)"></sunbird-pdf-player>
    ```

- Send input to render PDF player

Use the mock config in your component to send input to PDF player
Click to see the mock - [playerConfig](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-5.2.0/src/app/data.ts)
**Note:** : Send input config as string 


# Use as Angular library in angular app

For help getting started with a new Angular app, check out the [Angular CLI](https://angular.io/cli).
If you have an Angular ≥ 9 CLI project, you could simply use our schematics to add sunbird-pdf-player library to it.

## Step 1: Installation

Just run the following:
```red
ng add @project-sunbird/sunbird-pdf-player-v9
```

It will install sunbird-pdf-player for the default application specified in your `angular.json`. If you have multiple projects and you want to target a specific application, you could specify the `--project` option

```red
ng add @project-sunbird/sunbird-pdf-player-v9 --project myProject
```
### Manual installation
If you prefer not to use schematics or want to add `sunbird-pdf-player-v9` to an older project, you'll need to do the following:

<details>
  <summary>Click here to show detailed instructions!</summary>
  
  #### 1. Install the packages:

  ```bash
  npm install @project-sunbird/sunbird-pdf-player-v9 --save
  npm install @project-sunbird/sb-styles --save
  npm install @project-sunbird/client-services --save
  ```

  #### 2. Include the sb-styles and assets in angular.json configuration:
    
  Add following under architect.build.assets and styles
  
  ```diff
  {
    ...
    "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      ...
      "assets": [
      ...
  +   {
  +    "glob": "**/*.*",
  +    "input": "./node_modules/@project-sunbird/sunbird-pdf-player-v9/lib/assets/",
  +    "output": "/assets/"
  +   }	
      ...    
      ],
      "styles": [
      ...
  +   "./node_modules/@project-sunbird/sb-styles/assets/_styles.scss"    
      ...
      ],
      ...
    }
  ```
  

  #### 3. Import the modules and components:

  Import the NgModule where you want to use:

  ```diff
+  import { SunbirdPdfPlayerModule } from '@project-sunbird/sunbird-pdf-player-v9';
  @NgModule({
    ...
+    imports: [SunbirdPdfPlayerModule],
    ...
  })
  export class YourAppModule { }
  
  ```

</details>

## Step 2: Send input to render PDF player

Use the mock config in your component to send input to PDF player
Click to see the mock - [playerConfig](https://github.com/project-sunbird/sunbird-pdf-player/blob/release-4.5.0/src/app/data.ts)

## Player config
```js
var playerConfig = {
  "context": {
    "mode": "play",  // To identify preview used by the user to play/edit/preview
    "authToken": "", // Auth key to make  api calls
    "sid": "7283cf2e-d215-9944-b0c5-269489c6fa56", // User sessionid on portal or mobile 
    "did": "3c0a3724311fe944dec5df559cc4e006", // Unique id to identify the device or browser 
    "uid": "anonymous", // Current logged in user id
    "channel": "505c7c48ac6dc1edc9b08f21db5a571d", // Unique id of the channel(Channel ID)
    "pdata": {
      "id": "sunbird.portal", // Producer ID. For ex: For sunbird it would be "portal" or "genie"
      "ver": "3.2.12", // Version of the App
      "pid": "sunbird-portal.contentplayer" // Optional. In case the component is distributed, then which instance of that component
    },
    "contextRollup": { // Defines the content roll up data
      "l1": "505c7c48ac6dc1edc9b08f21db5a571d"
    },
    "tags": [ // Defines the tags data
      ""
    ],
    "cdata": [], // Defines correlation data
    "timeDiff": 0,  // Defines the time difference
    "objectRollup": {}, // Defines the object roll up data
    "host": "", // Defines the from which domain content should be load
    "endpoint": "", // Defines the end point
    "userData": {  // Defines the user data firstname & lastname
      "firstName": "",
      "lastName": ""
    }
  },
  "config": { 
    "sideMenu": { 
      "showShare": true, // show/hide share button in side menu. default value is true
      "showDownload": true, // show/hide download button in side menu. default value is true
      "showReplay": true, // show/hide replay button in side menu. default value is true
      "showExit": false, // show/hide exit button in side menu. default value is false
      "showPrint": true // show/hide print button in side menu. default value is true
    }
  },
  "metadata": {}, // Content metadata json object (from API response take -> response.result.content)
} 

```

## Metadata Mandatory property description
Metadata gives a complete information about the content.

Sample metadata object interface:

```js
"metadata": {
  identifier: string;
  name: string;
  artifactUrl: string;
  streamingUrl?: string;
  compatibilityLevel?: number;
  pkgVersion?: number;
  isAvailableLocally?: boolean;
  basePath?: string;
  baseDir?: string;
}
  ```
  
 In metadata the following properties are mandatory to play the content.
 
 |Property Name| Description|  Mandatory/Optional| Without field | Comment
|--|----------------------|--| --| --|
| `identifier` | It is  `string` of uniq content id | Mandatory | Unable to load the content error | Its a unique content id so Its a required to log the telemetry and other data against contnet|
| `Name` | It is  `string` to represent the name of the content or pdf | Mandatory | Unable to load the content error | Its a required to show the name of the pdf while loading the pdf|
| `artifactUrl` | It is  `string` url  to load the pdf from artifact url | Mandatory | Unable to load the content error | It is required to load the pdf file|
| `streamingUrl` | It is  `string` url  to load the pdf from streaming url | Optional | Unable to load the content error | It is optional field. This is required if you want to load the streaming pdf url|
| `isAvailableLocally` | It is a `boolen` value which indicate the content is locally available | Optional | Content will not load offline | It is required to know - the content is downloaded and can be play offline|
| `basePath` | It is `string` to represent the base path of the pdf file | Optional | Content will not load offline | It is required to load the pdf file in offline use case|
| `baseDir` | It is `string` to represent the base path of the pdf file | Optional | Content will not load offline |  It is required to load the pdf file in offline use case |
| `compatibilityLevel` | It is `number` to represent the compatibility level | Optional | Defalut compatibilityLevel 4 will set | Its an Optional field
| `pkgVersion` | It is `number` to represent the version of the current packages | Optional | Defalut compatibilityLevel 1.0 will set | its an optional field
 
  Sample config for mandatory fields
```js
var playerConfig = {
	"metadata": {
		identifier: 'do_31291455031832576019477',
		name: 'NAME_OF_THE_CONTENT',
		artifactUrl: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291458881611366418883/b331332333_std_5_mathssciencesocial_tm_term-1_opt.pdf'
    }	
}
```

## Telemetry property description
|Property Name| Description| Default Value | Mandatory/Optional| Comment|
|--|----------------------|--|--| --|
| `channel` | It is `string` which defines channel identifier to know which channel is currently using.| `in.sunbird` |Mandatory| Default can be set from player side.  Telemetry sdk will set by default ```“in.ekstep"```|
| `env` | It is an string containing Unique environment where the event has occurred | ```"contentplayer"```|Optional| Content player set it by default to “contentplayer"|
| `pdata` | It is an `object` which defines the producer information it should have identifier and version and canvas will log in the telemetry| ```{'id':'in.sunbird', 'ver':'1.0'}```|Mandatory| Default can be set from player side.  Telemetry sdk will set by default ```{ id: "in.ekstep", ver: "1.0", pid: "" }```|
| `mode` | It is  `string` to identify preview used by the user to play/edit/preview | ```play```|Optional| Telemetry sdk will set by default as ```"play"```|
| `sid` | It is an `string` containing user session id. | ```sid = uid  ```|Optional| Telemetry sdk will set by default as ```"uid"```|
| `did` | It is an `string` containing unique device id.| ```fingerPrintjs2```|Optional| Telemetry sdk will set by default  using ```fingerPrintJs```|
| `uid` |It is an `string` containing user id.| ```actor.id = did ? did : "anonymous" ```|Optional| Telemetry sdk will use ```did``` as default|
| `authToken` | It is an `string` to send telemetry to given endpoint (API uses for authentication) | ```''```|Optional| Player will set default ```""```|
| `contextRollup` | It is an `object` which defines content roll up data | ```{}```|Optional| Its an optional field in telemetry|
| `objectRollup` | It is an `object` which defines object rollup data | ```{}```|Optional| Its an optional field in telemetry|
| `tags` | It is an `array`. It can be used to tag devices so that summaries/metrics can be derived via specific tags. Helpful during analysis | ```[]```|Optional| Its an optional field in telemetry|
| `cdata` | It is an `array`. Correlation data. Can be used to correlate multiple events. Generally used to track user flow | ```[]```|Optional| This is an optional but - if we are passing the ````type``` and ```id``` is required.|
| `host` | It is  `string` which defines the from which domain content should be load|```window.location.origin```  |Optional| Content Player set it as `""` and Telemetry sdk will set by default as ```“https://api.ekstep.in"```|
| `userData` | It is an `object` which defines user data | ```Anoymous```|Optional| User first and lastname will not show in endpage|


## Config property description
|Property Name| Description| Default Value |  Mandatory/Optional
|--|----------------------|--| --|
| `config` | It is an `object` it contains the `sideMenu`, these will be used to configure the canvas  | ```{  sideMenu: {"showShare": true, "showDownload": true, "showReplay": true, "showExit": false,"showPrint": true}}``` | Optional |
| `config.sideMenu.showShare` | It is  `boolean` to show/hide share button in side menu| ```true```| Optional |
| `config.sideMenu.showDownload` | It is  `boolean` to show/hide download button in side menu| ```true```| Optional |
| `config.sideMenu.showReplay` | It is  `boolean` to show/hide replay button in side menu| ```true```| Optional |
| `config.sideMenu.showExit` | It is  `boolean` to show/hide exit button in side menu| ```false```| Optional |
| `config.sideMenu.showPrint` | It is  `boolean` to show/hide print button in side menu| ```true```| Optional |

## Available components
|Feature| Notes| Selector|Code|Input|Output
|--|--|--|------------------------------------------------------------------------------------------|---|--|
| PDF Player | Can be used to render pdf | sunbird-pdf-player| *`<sunbird-pdf-player [playerConfig]="playerConfig"><sunbird-pdf-player>`*|playerConfig|playerEvent, telemetryEvent|

<br /><br />

# Use as Angular library in Mobile app 
For existing apps, follow these steps to begin using.

## Step 1: Install the packages
Click to see the steps - [InstallPackages](README.md#step-1-install-the-packages)

## Step 2: Include the sb-styles and assets in angular.json

Click to see the steps - [IncludeStyles](README.md#step-2-include-the-sb-styles-and-assets-in-angularjson)
  
## Step 3: Import the modules and components

Click to see the steps - [Import](README.md#step-3-import-the-modules-and-components)


## Step 4: Import in component       

    <sunbird-video-player [playerConfig]="playerConfig" (playerEvent)="playerEvents($event)"
    (telemetryEvent)="playerTelemetryEvents($event)"></sunbird-video-player>  

## Step 5: Send input to render PDF player

Click to see the input data - [playerConfig](README.md#step-4-send-input-to-render-pdf-player)


## Sample code
Click to see the sample code - [sampleCode](https://github.com/Sunbird-Ed/SunbirdEd-mobile-app/blob/release-4.8.0/src/app/player/player.page.html)
<br /><br />
