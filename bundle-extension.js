import { exec } from "child_process";
import { copy } from "fs-extra";
import { copyFile, rm, writeFile } from "fs/promises";
import process from "process";
import readline from "readline";
import zipper from "zip-local";

const runCommand = (command, yes) =>
  new Promise((resolve, reject) => {
    exec(yes ? `echo "y" | ${command}` : command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });

let manifest = {
  name: "Sigarra extension",
  short_name: "Sigarra extension",
  description: "Sigarra in a simpler way.",
  version: "1.0.0",
  icons: {
    16: "images/logo/logo-16.png",
    32: "images/logo/logo-32.png",
    48: "images/logo/logo-48.png",
    128: "images/logo/logo-128.png",
  },
  permissions: ["storage"],
  options_ui: {
    page: "index.html",
    open_in_tab: true,
  },
};

const MANIFEST_CHROME = {
  ...manifest,
  manifest_version: 3,
  background: {
    service_worker: "background.js",
    type: "module",
  },
  content_scripts: [
    {
      run_at: "document_start",
      matches: ["https://sigarra.up.pt/feup/*"],
      css: ["css/simpler.css"],
    },
    {
      run_at: "document_end",
      matches: ["https://sigarra.up.pt/feup/*"],
      js: ["dist/main.js"],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        "css/main.css",
        "css/custom.css",
        "css/simpler.css",
      ],
      matches: ["https://sigarra.up.pt/*"],
    },
  ],
  action: {
    default_icon: {
      16: "images/logo/logo-16.png",
      32: "images/logo/logo-32.png",
      48: "images/logo/logo-48.png",
    },
    default_title: "Sigarra extension",
    default_popup: "index.html",
  },
};

const MANIFEST_FIREFOX = {
  ...manifest,
  manifest_version: 2,
  browser_specific_settings: {
    gecko: {
      //id: "", //TODO: add this
    },
  },
  background: {
    scripts: ["background.js"],
    persistent: false,
  },
  content_scripts: [
    {
      run_at: "document_start",
      matches: ["https://sigarra.up.pt/feup/*"],
      js: ["dist/main.js"],
    },
  ],
  web_accessible_resources: [
    "css/main.css",
    "css/simpler.css",
    "css/custom.css"
  ],
  browser_action: {
    default_icon: {
      16: "images/logo/logo-16.png",
      32: "images/logo/logo-32.png",
      48: "images/logo/logo-48.png",
    },
    default_title: "Sigarra extension",
    default_popup: "index.html",
  },
};

const bundle = async (manifest, bundleDirectory) => {
  try {
    // Remove old bundle directory
    await rm(bundleDirectory, { recursive: true, force: true }); // requires node 14+
    console.log(`🧹  Cleaned up \`${bundleDirectory}\` directory.`);

    // Run both build scripts
    const runBuildScript = (directory) => {
      return new Promise(async (resolve, reject) => {
        let intervalId;
        let spinner = "\\";
        const startBuilding = () => {
          let P = ["\\", "|", "/", "-"];
          intervalId = setInterval(() => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            spinner = P[P.indexOf(spinner) + 1] || P[0];
            process.stdout.write(
              `${spinner}   Building popup and content scripts...`
            );
          }, 250);
        };

        startBuilding();

        try {
          await runCommand(`cd ./${directory} && yarn && yarn build`);
          clearInterval(intervalId);
          resolve();
        } catch (error) {
          clearInterval(intervalId);
          console.error(
            `Error running build script for ${directory}: ${error}`
          );
          reject(error);
        }
      });
    };

    await runBuildScript("popup");
    await runBuildScript("content-scripts");

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log("🔥  Built popup and content scripts.");

    // Bundle popup Next.js export
    await copy("popup/out", `${bundleDirectory}`);
    console.log(`🚗  Moved export to bundle.`);

    // Bundle content-scripts
    await copy("content-scripts/dist", `${bundleDirectory}/dist`);
    console.log(`🚗  Moved content_scripts to bundle.`);

    // Bundle background.js
    await copyFile("background.js", `${bundleDirectory}/background.js`);
    console.log(`🚗  Moved background.js to bundle.`);

    // Bundle css
    await copy("css", `${bundleDirectory}/css`);
    console.log(`🚗  Moved css to bundle.`);

    // Bundle custom fonts
    // await copy("fonts", `${bundleDirectory}/fonts`);
    // console.log(`🚗  Moved fonts to bundle.`);

    // Bundle images
    await copy("images", `${bundleDirectory}/images`);
    console.log(`🚗  Moved images to bundle.`);

    // Create manifest
    await writeFile(
      `${bundleDirectory}/manifest.json`,
      Buffer.from(JSON.stringify(manifest, null, 2)),
      "utf8"
    );

    // Done.
    console.log(`📦  Bundled \`${bundleDirectory}\`.`);

    // Zip the directory
    zipper.sync
      .zip(`./${bundleDirectory}`)
      .compress()
      .save(`./bundle/${bundleDirectory.replace("bundle/", "")}.zip`);

    console.log(
      `🧬  Zipped \`${bundleDirectory}\` to \`bundle/${bundleDirectory.replace(
        "bundle/",
        ""
      )}.zip\`.`
    );
  } catch (error) {
    console.error(error);
  }
};

const bundleAll = async () => {
  await bundle(MANIFEST_CHROME, "bundle/chrome");
  await bundle(MANIFEST_FIREFOX, "bundle/firefox");
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Which browser would you like to bundle for? [All / Chrome / Firefox / Safari] ",
  async (browser) => {
    switch (browser) {
      case "Chrome":
        await bundle(MANIFEST_CHROME, "bundle/chrome");
        break;

      case "Firefox":
        await bundle(MANIFEST_FIREFOX, "bundle/firefox");
        break;

      case "Safari":
        await bundle(MANIFEST_FIREFOX, "bundle/firefox");

        let intervalId;
        let spinner = "\\";
        const startBuilding = () => {
          let P = ["\\", "|", "/", "-"];
          intervalId = setInterval(() => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            spinner = P[P.indexOf(spinner) + 1] || P[0];
            process.stdout.write(`${spinner}   Bundling Safari...`);
          }, 250);
        };

        startBuilding();

        await runCommand(generateSafariProjectCommand, true);
        await runCommand(fixBundleIdentifierCommand, true);

        clearInterval(intervalId);
        break;

      case "All":
        await bundleAll();
        break;

      default:
        await bundleAll();
    }

    rl.close();
  }
);

rl.on("close", () => {
  process.exit(0);
});

const generateSafariProjectCommand = `xcrun safari-web-extension-converter bundle/firefox --project-location bundle/safari --app-name 'Sigarra Extension' --bundle-identifier 'com.niaefeup.sigarra-extension'`;

// The first command currently ignores the full --bundle-identifier flag (it still take the company name), so a replace is required to make sure it matches our bundle identifier
const fixBundleIdentifierCommand = `find "bundle/safari/Sigarra Extension" \\( -name "*.swift" -or -name "*.pbxproj" \\) -type f -exec sed -i '' 's/com.niaefeup.sigarra-extension/com.niaefeup.sigarra-extension/g' {} +`;

