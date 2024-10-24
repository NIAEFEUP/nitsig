## Developing

First, you must have [yarn](https://classic.yarnpkg.com/lang/en/docs/install) installed.

Install dependencies:

```sh
yarn install
```

Build for the first time:

```sh
yarn build
```

Choose your favorite browser and start developing:

```sh
yarn run dev:firefox
```

or

```sh
yarn run dev:chrome
```

This command will initialize a browser window and load the extension, watching for changes and reloading the window automatically.

## Building a bundle

```sh
yarn build
```

## Linting and formatting

In order to maintain our codebase we are using [Prettier](https://prettier.io/) for formatting and [ESLint](https://eslint.org/) for linting.

If you only want to check for formatting issues run:

```sh
yarn format
```

Or if you want to have Prettier fix them:

```sh
yarn format:fix
```

Similarly, to check for linting issues run:

```sh
yarn lint
```

And, if you wish to fix the warnings that ESLint picks up, run:

```sh
yarn lint:fix
```

## Loading a bundle

<table>
	<tr>
		<th>Chrome or Edge</th>
		<th>Firefox</th>
		<th>Safari</th>
	</tr>
	<tr>
		<td width="33.33%">
			<ol>
				<li>Open <code>chrome://extensions</code> or <code>edge://extensions</code></li>
        <li>Turn on the <strong>Developer mode</strong> toggle</li>
				<li>Click on the <strong>Load unpacked</strong> button</li>
				<li>Select the folder <code>bundle/chrome</code></li>
			</ol>
		</td>
		<td width="33.33%">
			<ol>
				<li>Open <code>about:debugging#/runtime/this-firefox</code></li>
				<li>Click on the <strong>Load Temporary Add-on...</strong> button</li>
				<li>Select the file <code>bundle/firefox/manifest.json</code></li>
			</ol>
		</td>
      <td width="33.33%">
			<ol>
				<li>Open <code>bundle/safari/NitSig for NitSig.xcodeproj</code></li>
				<li>Click the Play button in Xcode ("start the active scheme")</li>
				<li><a href="https://developer.apple.com/documentation/safariservices/safari_web_extensions/running_your_safari_web_extension#3744467">Configure Safari in macOS to run unsigned extensions</a></li>
			</ol>
		</td>
	</tr>
</table>
