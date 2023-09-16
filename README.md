## Development / Building / Bundling the Extension

First, you must have [yarn](https://classic.yarnpkg.com/lang/en/docs/install) installed.

Run
```sh
yarn && yarn bundle [all | firefox | chrome | safari]
```
at the root directory and you'll get a bundle directory that looks like this:

```
📂 bundle
└ 📁 chrome
└ 📁 firefox
└ 📁 safari
└ 🗄️ chrome.zip
└ 🗄️ firefox.zip
└ 🗄️ safari.zip
```

## Watch for changes

```sh
sudo yarn watch [firefox | chrome | safari]
```

The extension polls the watch webserver for changes, if the page doesn't reload automatically, reload the extension and if that doesn't work, see the service worker/background script console for errors.

## Load Extension

You can bundle the extension for `Chrome`, `Firefox`, and `Safari`:

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

#### This respository was based on the [typefully/minimal-twitter](https://github.com/typefully/minimal-twitter) extension repository
