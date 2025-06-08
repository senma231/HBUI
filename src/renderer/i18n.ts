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

      // Package details
      loading: 'Loading',
      loading_package_details: 'Loading package details...',
      error: 'Error',
      retry: 'Retry',
      version: 'Version',
      status: 'Status',
      installed: 'Installed',
      not_installed: 'Not Installed',
      outdated: 'Outdated',
      description: 'Description',
      homepage: 'Homepage',
      dependencies: 'Dependencies',
      used_by: 'Used by',

      // Search options
      search_type_all: 'All',
      search_type_formula: 'Formulae',
      search_type_cask: 'Casks',
      sort_by_name: 'Name',
      sort_by_relevance: 'Relevance',
      sort_by_downloads: 'Downloads',
      search_type: 'Type',
      recent_searches: 'Recent searches',
      details: 'Details',

      // Tag management
      manage_tags: 'Manage Tags',
      create_new_tag: 'Create New Tag',
      tag_name: 'Tag Name',
      tag_description_optional: 'Description (optional)',
      create_tag: 'Create Tag',
      creating: 'Creating...',
      existing_tags: 'Existing Tags',
      no_tags_created: 'No tags created yet',
      confirm_delete_tag: 'Are you sure you want to delete this tag?',
      manage_package_tags: 'Manage Package Tags',
      no_tags_available: 'No tags available',
      create_tags_first: 'Create some tags first using the tag manager',
      current_tags: 'Current Tags',
      done: 'Done',
      close: 'Close',
      delete: 'Delete',
      tags: 'Tags',
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

      // Package details
      loading: '加载中',
      loading_package_details: '正在加载软件包详情...',
      error: '错误',
      retry: '重试',
      version: '版本',
      status: '状态',
      installed: '已安装',
      not_installed: '未安装',
      outdated: '有更新',
      description: '描述',
      homepage: '主页',
      dependencies: '依赖项',
      used_by: '被使用于',

      // Search options
      search_type_all: '全部',
      search_type_formula: '公式',
      search_type_cask: '应用',
      sort_by_name: '名称',
      sort_by_relevance: '相关性',
      sort_by_downloads: '下载量',
      search_type: '类型',
      recent_searches: '最近搜索',
      details: '详情',

      // Tag management
      manage_tags: '管理标签',
      create_new_tag: '创建新标签',
      tag_name: '标签名称',
      tag_description_optional: '描述（可选）',
      create_tag: '创建标签',
      creating: '创建中...',
      existing_tags: '现有标签',
      no_tags_created: '尚未创建任何标签',
      confirm_delete_tag: '确定要删除这个标签吗？',
      manage_package_tags: '管理软件包标签',
      no_tags_available: '没有可用的标签',
      create_tags_first: '请先使用标签管理器创建一些标签',
      current_tags: '当前标签',
      done: '完成',
      close: '关闭',
      delete: '删除',
      tags: '标签',
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

      // Package details
      loading: '載入中',
      loading_package_details: '正在載入軟體包詳情...',
      error: '錯誤',
      retry: '重試',
      version: '版本',
      status: '狀態',
      installed: '已安裝',
      not_installed: '未安裝',
      outdated: '有更新',
      description: '描述',
      homepage: '主頁',
      dependencies: '依賴項',
      used_by: '被使用於',

      // Search options
      search_type_all: '全部',
      search_type_formula: '公式',
      search_type_cask: '應用',
      sort_by_name: '名稱',
      sort_by_relevance: '相關性',
      sort_by_downloads: '下載量',
      search_type: '類型',
      recent_searches: '最近搜尋',
      details: '詳情',

      // Tag management
      manage_tags: '管理標籤',
      create_new_tag: '創建新標籤',
      tag_name: '標籤名稱',
      tag_description_optional: '描述（可選）',
      create_tag: '創建標籤',
      creating: '創建中...',
      existing_tags: '現有標籤',
      no_tags_created: '尚未創建任何標籤',
      confirm_delete_tag: '確定要刪除這個標籤嗎？',
      manage_package_tags: '管理軟體包標籤',
      no_tags_available: '沒有可用的標籤',
      create_tags_first: '請先使用標籤管理器創建一些標籤',
      current_tags: '當前標籤',
      done: '完成',
      close: '關閉',
      delete: '刪除',
      tags: '標籤',
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
