import { exec } from "child_process";
import { copy, pathExists } from "fs-extra";
import { copyFile, rm, writeFile, appendFile, readFile} from "fs/promises";
import process, { argv } from "process";
import zipper from "zip-local";
import { MANIFEST_CHROME, MANIFEST_FIREFOX } from "./manifest.js";
import klaw from "klaw";
import * as path from 'path';

const CHANGES_FILENAME = ".changes.json"


let lastChangedFiles = new Map();
const loadLastChangedFiles = async () => {
  if(await pathExists(CHANGES_FILENAME)){
    lastChangedFiles = new Map(Object.entries(
      JSON.parse(
        (await readFile(CHANGES_FILENAME)).toString()
      )
    ));
  }
}

let newChangedFiles = new Map();
const writeNewChangedFiles = async () => {
  await writeFile(CHANGES_FILENAME, JSON.stringify(Object.fromEntries(newChangedFiles)));
}



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

const bundle = async (manifest, bundleDirectory, browserFunc) => {
  try {
    // Remove old bundle directory
    await rm(bundleDirectory, { recursive: true, force: true }); // requires node 14+
    console.log(`🧹  Cleaned up \`${bundleDirectory}\` directory.`);

    // Run both build scripts
    const runBuildScript = (directory) => {
      return new Promise(async (resolve, reject) => {
        let intervalId;
        let files = new Map();
        klaw(directory, {filter: (path) => {
          return !(path.includes("out") 
            || path.includes("node_modules") || path.includes(".next") || path.includes(".parcel-cache"));
        }})
        .on("data", (item) => {
          if(!files.has(item.path) && !item.stats.isDirectory()) files.set(item.path, item.stats.mtimeMs);
        })
        .on("end", async () => {
          let shouldRunBool = false;
          for(let file of files.entries()){
            if(!lastChangedFiles.has(file[0])){
              shouldRunBool = true;
              break;
            } else if(lastChangedFiles.get(file[0]) < file[1]){
              shouldRunBool = true;
              break;
            }
          }
          newChangedFiles = new Map([...newChangedFiles, ...files]);
          if(!shouldRunBool){
            console.log(`⏭️ Skipping building of ${directory} because there are no modifications...`);
            resolve();
            return;
          }
          console.log(`🏗️  Building ${directory} after modifications...`);
          try {
            await runCommand(`cd ./${directory} && yarn && yarn build`);
            resolve();
          } catch (error) {
            console.error(
              `Error running build script for ${directory}: ${error}`
            );
            reject(error);
          }
        });


      });
    };

    await loadLastChangedFiles();
    await runBuildScript("popup");
    await runBuildScript("content-scripts");
    await writeNewChangedFiles();

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

    // Bundle js
    await copy("js", `${bundleDirectory}/js`);
    console.log(`🚗  Moved js to bundle.`);

    // Bundle custom fonts
    // await copy("fonts", `${bundleDirectory}/fonts`);
    // console.log(`🚗  Moved fonts to bundle.`);

    // Bundle images
    await copy("images", `${bundleDirectory}/images`);
    console.log(`🚗  Moved images to bundle.`);

    // Bundle html
    await copy("html", `${bundleDirectory}/html`);
    console.log(`🚗  Moved extension pages to bundle.`);

    // Create manifest
    await writeFile(
      `${bundleDirectory}/manifest.json`,
      Buffer.from(JSON.stringify(manifest, null, 2)),
      "utf8"
    );

    await browserFunc(bundleDirectory);

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



const processArguments = async () => {
    if(process.argv.length < 3){
      console.log("Error: didn't supply a build option...");
      printUsageAndExit();
    }
    let option = process.argv[2].toLowerCase();
    let debugMode = true;
    if(process.argv.length >= 4){
      if(!(process.argv[3] === "release" || process.argv[3] === "debug")){
        console.log("Error: 2nd argument should be either release or debug");
        printUsageAndExit();
      }
      debugMode = argv[3] === "debug";
    }
    const allBrowserDebug = (bundleDirectory) => {
      return new Promise((resolve) => {
        let allBrowserFiles = []
        klaw("dev", {depthLimit: 1})
        .on("data", (item) => {
          if(!item.stats.isDirectory()){
            allBrowserFiles.push(item.path)
          }
        })
        .on("end", async () => {
          for(let file of allBrowserFiles){
            await appendFile(`${bundleDirectory}/${path.basename(file)}`, await (await readFile(file)).toString());
          }
          resolve();
        });
      })

    }

    const firefoxDebug = async (bundleDirectory) => {
      if(debugMode){
        await allBrowserDebug(bundleDirectory);
      }
    };
    switch (option) {
      case "all":
      case "chrome":
        var manifest = MANIFEST_CHROME;
        if(debugMode){
          manifest.host_permissions = [...manifest.host_permissions, "https://localhost:8069/*"]
          manifest.permissions = [...manifest.permissions, "alarms"];
        }
        await bundle(manifest, "bundle/chrome",
        async (bundleDirectory) => {
          if(debugMode){
            await allBrowserDebug(bundleDirectory);
          }
        });
        if(option != "all") break;

      case "firefox":
        var manifest = MANIFEST_FIREFOX;
        if(debugMode){
          manifest.host_permissions = [...manifest.host_permissions, "https://localhost:8069/*"]
          manifest.permissions = [...manifest.permissions, "alarms"]
        }
        await bundle(manifest, "bundle/firefox", firefoxDebug);
        if(option != "all") break;

      case "safari":
        var manifest = MANIFEST_FIREFOX;
        if(debugMode){
          manifest.host_permissions = [...manifest.host_permissions, "https://localhost:8069/*"]
          manifest.permissions = [...manifest.permissions, "alarms"]
        }
        if(process.platform !== "darwin"){
          console.log("Skipping safari build since we are not on MacOS...");
          break;
        } 
        if(option != "all") await bundle(MANIFEST_FIREFOX, "bundle/firefox");

        await runCommand(generateSafariProjectCommand, true);
        await runCommand(fixBundleIdentifierCommand, true);

        break;
    }
};



const generateSafariProjectCommand = `xcrun /Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter bundle/firefox --project-location bundle/safari --app-name 'NitSig' --bundle-identifier 'pt.up.fe.ni.nitsig'`;
// The first command currently ignores the full --bundle-identifier flag (it still take the company name), so a replace is required to make sure it matches our bundle identifier
const fixBundleIdentifierCommand = `find "bundle/safari/NitSig" \\( -name "*.swift" -or -name "*.pbxproj" \\) -type f -exec sed -i '' 's/pt.up.fe.ni.nitsig/pt.up.fe.ni.nitsig/g' {} +`;

await processArguments();

function printUsageAndExit() {
  console.log("Usage: yarn bundle all | firefox | chrome | safari <release|debug>");
  process.exit(1);
}
