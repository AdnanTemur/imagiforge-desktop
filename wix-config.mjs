import { MSICreator } from "electron-wix-msi";

const msiCreator = new MSICreator({
  appDirectory: path.join(__dirname, "out/imagiforge-desktop-win32-x64"),
  outputDirectory: path.join(__dirname, "out/msi"),
  exe: "imagiforge-desktop",
  description: "AI image generation",
  name: "ImagiForge",
  manufacturer: "Adnan Temur",
  version: "1.0.0",
  arch: "x64",
  shortcut: true, // This creates a shortcut
  shortcutName: "ImagiForge",
  icon: path.join(__dirname, "assets/logo_light.ico"),
  ui: {
    chooseDirectory: true,
  },
  options: {
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    allowPathOverride: true,
  },
});

// Step 2: Create a .wxs template file
const supportBinaries = await msiCreator.create();

// 🆕 Step 2a: optionally sign support binaries if you
// sign you binaries as part of of your packaging script
supportBinaries.forEach(async (binary) => {
  // Binaries are the new stub executable and optionally
  // the Squirrel auto updater.
  await signFile(binary);
});

// Step 3: Compile the template to a .msi file
await msiCreator.compile();
