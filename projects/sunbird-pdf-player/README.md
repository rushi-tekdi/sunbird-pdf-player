# Sunbird PDF Player
Player for playing pdf contents for sunbird applications

## prerequisite

  Node version > 12

## Usage


Quick start

`npm i @project-sunbird/sunbird-pdf-player-v8`


Add the module to the your player root module 

`import { SunbirdPdfPlayerModule  } from '@project-sunbird/sunbird-pdf-player-v8';`

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
                "input": "node_modules/@project-sunbird/sunbird-pdf-player-v8/lib/assets/",
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

## Development

  check out this repo with latest release version branch

  cd to {repo_path} in terminal

  run  `sh setup.sh`

  above script installs the dependecies and link the pdf player library project to demo app


  if you do any changes in library project run to get latest changes in demo app

  `npm run build-lib-link`

  once above command completed run `npm run start` which will run the player in demo app at http://localhost:4200



## References

https://github.com/mozilla/pdf.js/wiki/Debugging-PDF.js#url-parameters
