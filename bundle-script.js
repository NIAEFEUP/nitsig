import { exec } from "child_process";
import { copy } from "fs-extra";
import { copyFile, rm, writeFile, appendFile, readFile} from "fs/promises";
import process, { argv } from "process";
import zipper from "zip-local";
import { MANIFEST_CHROME, MANIFEST_FIREFOX } from "./manifest.js";

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
    };

    await runBuildScript("popup");
    await runBuildScript("content-scripts");

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
    var option = process.argv[2].toLowerCase();
    var debugMode = true;
    if(process.argv.length >= 4){
      if(!(process.argv[3] === "release" || process.argv[3] === "debug")){
        console.log("Error: 2nd argument should be either release or debug");
        printUsageAndExit();
      }
      debugMode = argv[3] === "debug";
    }

    const firefoxDebug = async (bundleDirectory) => {
      if(debugMode){
        await appendFile(`${bundleDirectory}/background.js`, 
          await (await readFile('dev/firefox/background.js')).toString()
        );
      }
    };
    switch (option) {
      case "all":
      case "chrome":
        var manifest = MANIFEST_CHROME;
        if(debugMode){
          manifest.permissions = [...manifest.permissions, "offscreen", "tabs"];
        }
        await bundle(manifest, "bundle/chrome",
        async (bundleDirectory) => {
          if(debugMode){
            await appendFile(`${bundleDirectory}/background.js`, 
              await (await readFile('dev/chrome/background.js')).toString()
            );
            await copyFile('dev/chrome/watch.html', `${bundleDirectory}/watch.html`);
            await copyFile('dev/chrome/watch.js', `${bundleDirectory}/watch.js`);
          }
        });
        if(option != "all") break;

      case "firefox":
        var manifest = MANIFEST_FIREFOX;
        if(debugMode){
          manifest.background.persistent = true;
        }
        await bundle(manifest, "bundle/firefox",firefoxDebug);
        if(option != "all") break;

      case "safari":
        var manifest = MANIFEST_FIREFOX;
        if(debugMode){
          manifest.background.persistent = true;
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



const generateSafariProjectCommand = `xcrun /Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter bundle/firefox --project-location bundle/safari --app-name 'Sigarra Extension' --bundle-identifier 'pt.up.fe.ni.sigarra-extension'`;
// The first command currently ignores the full --bundle-identifier flag (it still take the company name), so a replace is required to make sure it matches our bundle identifier
const fixBundleIdentifierCommand = `find "bundle/safari/Sigarra Extension" \\( -name "*.swift" -or -name "*.pbxproj" \\) -type f -exec sed -i '' 's/pt.up.fe.ni.sigarra-extension/pt.up.fe.ni.sigarra-extension/g' {} +`;

await processArguments();

function printUsageAndExit() {
  console.log("Usage: yarn bundle all | firefox | chrome | safari <release|debug>");
  process.exit(1);
}
