// Homebrew UI Application Logic

// Global state
let packages = [];
let installedPackages = [];
let loading = false;
let activeTab = 'search';
let currentLanguage = 'zh-CN';

// Internationalization
const translations = {
  'zh-CN': {
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
  },
  'zh-TW': {
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
  },
  'en': {
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
};

// Translation function
function t(key) {
  return translations[currentLanguage][key] || key;
}

// Update UI text based on current language
function updateUIText() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
  
  document.getElementById('app-title').textContent = t('app_title');
}

// Change language
function changeLanguage(lang) {
  currentLanguage = lang;
  updateUIText();
}

// Set loading state
function setLoading(isLoading) {
  loading = isLoading;
  const app = document.querySelector('.app');
  if (isLoading) {
    app.classList.add('loading');
  } else {
    app.classList.remove('loading');
  }
}

// Set active tab
function setActiveTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.tab-navigation button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`${tab}-tab-btn`).classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  
  activeTab = tab;
  
  // Load data for the active tab
  if (tab === 'installed') {
    loadInstalledPackages();
  }
}

// Load installed packages
async function loadInstalledPackages() {
  setLoading(true);
  try {
    const result = await window.electronAPI.brewList();
    if (result.success && result.data) {
      installedPackages = result.data.filter(pkg => pkg.trim() !== '');
      renderInstalledPackages();
    }
  } catch (error) {
    console.error('Failed to load installed packages:', error);
  } finally {
    setLoading(false);
  }
}

// Search packages
async function searchPackages() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;
  
  setLoading(true);
  const searchBtn = document.getElementById('search-btn');
  searchBtn.querySelector('span').textContent = t('searching');
  
  try {
    const result = await window.electronAPI.brewSearch(query);
    if (result.success && result.data) {
      packages = result.data
        .filter(pkg => pkg.trim() !== '')
        .map(name => ({
          name,
          installed: installedPackages.includes(name)
        }));
      renderSearchResults();
    }
  } catch (error) {
    console.error('Failed to search packages:', error);
  } finally {
    setLoading(false);
    searchBtn.querySelector('span').textContent = t('search');
  }
}

// Install package
async function installPackage(packageName) {
  setLoading(true);
  try {
    const result = await window.electronAPI.brewInstall(packageName);
    if (result.success) {
      await loadInstalledPackages();
      // Update the package list to reflect installation
      packages = packages.map(pkg => 
        pkg.name === packageName ? { ...pkg, installed: true } : pkg
      );
      renderSearchResults();
    } else {
      alert(`${t('install_failed')}: ${result.error}`);
    }
  } catch (error) {
    console.error('Failed to install package:', error);
    alert(`${t('install_failed')}: ${error}`);
  } finally {
    setLoading(false);
  }
}

// Uninstall package
async function uninstallPackage(packageName) {
  setLoading(true);
  try {
    const result = await window.electronAPI.brewUninstall(packageName);
    if (result.success) {
      await loadInstalledPackages();
      // Update the package list to reflect uninstallation
      packages = packages.map(pkg => 
        pkg.name === packageName ? { ...pkg, installed: false } : pkg
      );
      renderSearchResults();
      renderInstalledPackages();
    } else {
      alert(`${t('uninstall_failed')}: ${result.error}`);
    }
  } catch (error) {
    console.error('Failed to uninstall package:', error);
    alert(`${t('uninstall_failed')}: ${error}`);
  } finally {
    setLoading(false);
  }
}

// Update Homebrew
async function updateHomebrew() {
  setLoading(true);
  try {
    const result = await window.electronAPI.brewUpdate();
    if (result.success) {
      alert(t('update_success'));
    } else {
      alert(`${t('update_failed')}: ${result.error}`);
    }
  } catch (error) {
    console.error('Failed to update Homebrew:', error);
    alert(`${t('update_failed')}: ${error}`);
  } finally {
    setLoading(false);
  }
}

// Upgrade packages
async function upgradePackages() {
  setLoading(true);
  try {
    const result = await window.electronAPI.brewUpgrade();
    if (result.success) {
      alert(t('upgrade_success'));
      await loadInstalledPackages();
    } else {
      alert(`${t('upgrade_failed')}: ${result.error}`);
    }
  } catch (error) {
    console.error('Failed to upgrade packages:', error);
    alert(`${t('upgrade_failed')}: ${error}`);
  } finally {
    setLoading(false);
  }
}

// Run doctor
async function runDoctor() {
  setLoading(true);
  try {
    const result = await window.electronAPI.brewDoctor();
    if (result.success) {
      alert(`${t('doctor_result')}:\n${result.data}`);
    } else {
      alert(`${t('doctor_failed')}: ${result.error}`);
    }
  } catch (error) {
    console.error('Failed to run brew doctor:', error);
    alert(`${t('doctor_failed')}: ${error}`);
  } finally {
    setLoading(false);
  }
}

// Render search results
function renderSearchResults() {
  const container = document.getElementById('search-results');
  container.innerHTML = '';
  
  packages.forEach(pkg => {
    const item = document.createElement('div');
    item.className = 'package-item';
    
    item.innerHTML = `
      <span class="package-name">${pkg.name}</span>
      <div class="package-actions">
        ${pkg.installed 
          ? `<button class="uninstall-btn" onclick="uninstallPackage('${pkg.name}')">${t('uninstall')}</button>`
          : `<button class="install-btn" onclick="installPackage('${pkg.name}')">${t('install')}</button>`
        }
      </div>
    `;
    
    container.appendChild(item);
  });
}

// Render installed packages
function renderInstalledPackages() {
  const container = document.getElementById('installed-packages');
  container.innerHTML = '';
  
  installedPackages.forEach(pkg => {
    const item = document.createElement('div');
    item.className = 'package-item';
    
    item.innerHTML = `
      <span class="package-name">${pkg}</span>
      <div class="package-actions">
        <button class="uninstall-btn" onclick="uninstallPackage('${pkg}')">${t('uninstall')}</button>
      </div>
    `;
    
    container.appendChild(item);
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  updateUIText();
  loadInstalledPackages();
  
  // Add enter key support for search
  document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchPackages();
    }
  });
});
