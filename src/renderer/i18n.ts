import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      app_title: 'Homebrew UI',
      search_packages: 'Search Packages',
      installed_packages: 'Installed Packages',
      maintenance: 'Maintenance',
      search_placeholder: 'Enter package name to search...',
      search: 'Search',
      searching: 'Searching...',
      install: 'Install',
      uninstall: 'Uninstall',
      refresh: 'Refresh',
      update_homebrew: 'Update Homebrew',
      upgrade_packages: 'Upgrade All Packages',
      run_doctor: 'Run Doctor',
      install_failed: 'Installation failed',
      uninstall_failed: 'Uninstallation failed',
      update_success: 'Homebrew updated successfully',
      update_failed: 'Update failed',
      upgrade_success: 'Packages upgraded successfully',
      upgrade_failed: 'Upgrade failed',
      doctor_result: 'Doctor Result',
      doctor_failed: 'Doctor check failed',
    }
  },
  'zh-CN': {
    translation: {
      app_title: 'Homebrew 图形界面',
      search_packages: '搜索软件包',
      installed_packages: '已安装软件包',
      maintenance: '系统维护',
      search_placeholder: '输入软件包名称进行搜索...',
      search: '搜索',
      searching: '搜索中...',
      install: '安装',
      uninstall: '卸载',
      refresh: '刷新',
      update_homebrew: '更新 Homebrew',
      upgrade_packages: '升级所有软件包',
      run_doctor: '运行诊断',
      install_failed: '安装失败',
      uninstall_failed: '卸载失败',
      update_success: 'Homebrew 更新成功',
      update_failed: '更新失败',
      upgrade_success: '软件包升级成功',
      upgrade_failed: '升级失败',
      doctor_result: '诊断结果',
      doctor_failed: '诊断检查失败',
    }
  },
  'zh-TW': {
    translation: {
      app_title: 'Homebrew 圖形介面',
      search_packages: '搜尋軟體包',
      installed_packages: '已安裝軟體包',
      maintenance: '系統維護',
      search_placeholder: '輸入軟體包名稱進行搜尋...',
      search: '搜尋',
      searching: '搜尋中...',
      install: '安裝',
      uninstall: '卸載',
      refresh: '重新整理',
      update_homebrew: '更新 Homebrew',
      upgrade_packages: '升級所有軟體包',
      run_doctor: '執行診斷',
      install_failed: '安裝失敗',
      uninstall_failed: '卸載失敗',
      update_success: 'Homebrew 更新成功',
      update_failed: '更新失敗',
      upgrade_success: '軟體包升級成功',
      upgrade_failed: '升級失敗',
      doctor_result: '診斷結果',
      doctor_failed: '診斷檢查失敗',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already does escaping
    }
  });

export default i18n;
