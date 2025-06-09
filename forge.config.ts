import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
// import { FusesPlugin } from '@electron-forge/plugin-fuses';
// import { FuseV1Options, FuseVersion } from '@electron/fuses';

const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'HBUI',
    executableName: 'hbui',
    appBundleId: 'com.hbui.app',
    appCategoryType: 'public.app-category.developer-tools',
    appVersion: '1.0.0',
    buildVersion: '1.0.0',
    appCopyright: 'Copyright © 2024 HBUI Team',
    protocols: [
      {
        name: 'HBUI Protocol',
        schemes: ['hbui']
      }
    ]
  },
  rebuildConfig: {},
  makers: [
    // Windows
    new MakerSquirrel({
      name: 'HBUI',
      setupExe: 'HBUI-Setup.exe',
      authors: 'HBUI Team',
      description: 'Modern GUI for Homebrew package manager'
    }),
    // macOS
    new MakerZIP({}, ['darwin']),
    // Linux
    new MakerDeb({
      options: {
        name: 'hbui',
        productName: 'HBUI',
        genericName: 'Homebrew GUI',
        description: 'Modern GUI for Homebrew package manager',
        categories: ['Development', 'Utility'],
        maintainer: 'HBUI Team <team@hbui.app>',
        homepage: 'https://github.com/senma231/HBUI'
      }
    }),
    new MakerRpm({
      options: {
        name: 'hbui',
        productName: 'HBUI',
        genericName: 'Homebrew GUI',
        description: 'Modern GUI for Homebrew package manager',
        categories: ['Development', 'Utility'],
        maintainer: 'HBUI Team <team@hbui.app>',
        homepage: 'https://github.com/senma231/HBUI'
      }
    })
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/main/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    // Disabled for now due to Electron version compatibility
    /*
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
    */
  ],
};

export default config;
