const path = require("path");
const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-wix",
      config: {
        appDirectory: path.join(__dirname, "out/imagiforge-desktop-win32-x64"),
        outputDirectory: path.join(__dirname, "out/msi"),
        exe: "imagiforge-desktop",
        description: "AI image generation",
        name: "ImagiForge",
        manufacturer: "Adnan Temur",
        version: "1.0.0",
        arch: "x64",
        shortcut: true,
        icon: path.join(__dirname, "assets/logo_light.ico"),
        ui: {
          chooseDirectory: true,
        },
        options: {
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          allowPathOverride: true,
          installScope: "perMachine", // Install for all users (requires admin rights)
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
