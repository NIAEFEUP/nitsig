# SIGARRA Extension

## Building the extension

First, you must have [yarn](https://classic.yarnpkg.com/lang/en/docs/install) installed.

Then, you can run `yarn` to install the dependencies, and `yarn build` to build the extension, which will be placed in the `dist` folder.

This will build the extension for chromium based browsers. To build for Firefox, run `yarn build:firefox`.

## Development

Running `yarn dev` will start the development server, which will serve the extension files and reload the extension when changes are made.
In addition, it will also start up a browser instance with the extension loaded and SIGARRA already opened.

If for some reason that command does not work, you can run `yarn watch`, but this command is generally slower and less reliable.

Both commands accept the suffix `:firefox` to build the extension for Firefox instead of Chromium based browsers.

## Folder structure

The `src` folder contains the source code for the extension, which follows the following structure:

-   `background`: Contains the background script, which runs in the background and can listen for events.
-   `common`: Contains code that is shared between all parts of the extension.
-   `components`: Contains the React components used in the extension.
-   `content-scripts`: Contains the content scripts, which run in the context of the page and can interact with the DOM.

    -   `components`: Contains scripts that modify a small part of the page.
    -   `options`: Contains scripts that modify the page in a configurable way.
    -   `pages`: Contains scripts that modify a singular page extensively.

-   `content-styles`: Contains the stylesheets for the content scripts.
-   `options`: Contains the options page, which is used to configure the extension.
-   `popup`: Contains the popup page, which is the page that opens when the extension icon is clicked.
-   `post-install`: Contains the post-install page, which is the page that opens after the extension is installed.
-   `script-overrides`: Contains the script overrides, which are used to override the default SIGARRA scripts and functions.
-   `styles`: Contains the stylesheets for the extension.
-   `manifest.ts`: Contains the manifest for the extension, which defines the extension's name, description, permissions, etc.
