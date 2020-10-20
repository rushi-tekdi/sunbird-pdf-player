# Sunbird Pdf Player

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.10.
Node version 12

## Usage


Quick start

`npm i @project-sunbird/sunbird-pdf-player`


Add the module to the your player root module 

`import { SunbirdPdfPlayerModule  } from '@project-sunbird/sunbird-pdf-player';`

```javascript
@NgModule({
  ...
  imports: [
    ...,
    SunbirdPdfPlayerModule
  ]
})
```

add the assets in angular.json file

```javascript
....
 "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "node_modules/@project-sunbird/sunbird-pdf-player/lib/assets/",
                "output": "/assets/"
              }

...

```

add the component selector in your component like below

```html

            <sunbird-pdf-player 
             [playerConfig]="pdfPlayerConfig" (playerEvent)="pdfEventHandler($event)"
             (telemetryEvent)="telemetryEvent($event)"
            ></sunbird-pdf-player>

```

for playerConfig input refer

https://github.com/project-sunbird/sunbird-pdf-player/blob/release-3.4.0/projects/sunbird-pdf-player/src/lib/playerInterfaces.ts


## Development

check out this repo

open terminal and run  `sh setup.sh`

above script installs the dependecies and link the pdf player library project to demo app

open two terminal windows 

RUN `npm run start-lib` this will build pdf player library and watch for changes

in another terminal run `npm run start` which will run the player in demo app at http://localhost:4200
