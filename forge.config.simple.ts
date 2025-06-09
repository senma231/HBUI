import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';

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
    // Linux - DEB for Debian/Ubuntu
    new MakerDeb({
      options: {
        name: 'hbui',
        productName: 'HBUI',
        genericName: 'Homebrew GUI',
        description: 'Modern GUI for Homebrew package manager',
        categories: ['Development', 'Utility'],
        maintainer: 'HBUI Team <team@hbui.app>',
        homepage: 'https://github.com/senma231/HBUI',
        bin: 'hbui'
      }
    })
  ],
  plugins: []
};

export default config;
