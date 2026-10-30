(() => {
  'use strict';

  const releaseApi = 'https://api.github.com/repos/pref1x-1/MiniAdam-AI/releases/latest';
  const releasesPage = 'https://github.com/pref1x-1/MiniAdam-AI/releases';
  const installerPattern = /^miniadam[-_ ]setup.*\.exe$/i;

  const langButton = document.getElementById('lang');
  const downloadButton = document.getElementById('downloadButton');
  const finalDownload = document.getElementById('finalDownload');
  const downloadStatus = document.getElementById('downloadStatus');
  const statusText = downloadStatus?.querySelector('span:last-child');
  const versionBadge = document.getElementById('versionBadge');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const yearNode = document.getElementById('year');

  let currentLanguage = 'he';
  let downloadState = 'checking';
  let currentAsset = null;
  let currentRelease = null;

  try {
    currentLanguage = localStorage.getItem('miniadam-site-language') === 'en' ? 'en' : 'he';
  } catch {
    currentLanguage = 'he';
  }

  function translate(node, language) {
    const value = node.dataset[language];
    if (value !== undefined) node.innerHTML = value;
  }

  function applyLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-he][data-en]').forEach((node) => translate(node, language));

    langButton.textContent = language === 'he' ? 'EN' : 'עב';
    langButton.setAttribute('aria-label', language === 'he' ? 'Switch to English' : 'החלף לעברית');

    if (statusText) statusText.textContent = getStatusMessage();
    renderDownloadState();

    try {
      localStorage.setItem('miniadam-site-language', language);
    } catch {
      // The site remains fully usable if local storage is unavailable.
    }
  }

  function getStatusMessage() {
    const messages = {
      checking: {
        he: 'בודק זמינות של המתקין הרשמי…',
        en: 'Checking the official installer…'
      },
      available: {
        he: currentAsset ? 'המתקין זמין · ' + formatBytes(currentAsset.size) + ' · הורדה מ־GitHub Releases' : 'המתקין זמין ב־GitHub Releases',
        en: currentAsset ? 'Installer available · ' + formatBytes(currentAsset.size) + ' · Download from GitHub Releases' : 'Installer available on GitHub Releases'
      },
      missing: {
        he: 'לא נמצא קובץ Setup בגרסה האחרונה. אפשר לפתוח את עמוד הגרסאות הרשמי.',
        en: 'No Setup installer was found in the latest release. Open the official Releases page.'
      },
      error: {
        he: 'לא הצלחנו לבדוק כרגע את GitHub. אפשר לפתוח ישירות את עמוד הגרסאות.',
        en: 'GitHub could not be checked right now. Open the Releases page directly.'
      }
    };
    return messages[downloadState][currentLanguage];
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '';
    return bytes >= 1024 * 1024
      ? (bytes / (1024 * 1024)).toFixed(1) + ' MB'
      : Math.round(bytes / 1024) + ' KB';
  }

  function renderDownloadState() {
    const available = downloadState === 'available' && currentAsset?.browser_download_url;
    const url = available ? currentAsset.browser_download_url : releasesPage;

    downloadButton.href = url;
    finalDownload.href = url;

    downloadButton.dataset.state = downloadState;
    finalDownload.dataset.state = downloadState;
    downloadStatus.dataset.state = downloadState;

    if (statusText) statusText.textContent = getStatusMessage();

    if (available) {
      downloadButton.setAttribute('aria-label', currentLanguage === 'he'
        ? 'הורד את MINI ADAM Setup'
        : 'Download MINI ADAM Setup');
      versionBadge.textContent = currentRelease?.tag_name || 'SETUP';
      downloadButton.title = currentAsset.name;
    } else {
      versionBadge.textContent = 'SETUP';
      downloadButton.title = currentLanguage === 'he' ? 'פתיחת עמוד הגרסאות' : 'Open releases page';
    }
  }

  async function loadLatestInstaller() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7500);

    try {
      const response = await fetch(releaseApi, {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store',
        signal: controller.signal
      });

      if (!response.ok) throw new Error('GitHub Releases returned ' + response.status);

      const release = await response.json();
      const assets = Array.isArray(release.assets) ? release.assets : [];

      currentAsset = assets
        .filter((asset) =>
          asset &&
          asset.state === 'uploaded' &&
          installerPattern.test(asset.name || '') &&
          typeof asset.browser_download_url === 'string'
        )
        .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))[0] || null;

      currentRelease = release;
      downloadState = currentAsset ? 'available' : 'missing';
    } catch (error) {
      console.warn('[MINI ADAM] Release lookup failed:', error);
      currentAsset = null;
      downloadState = 'error';
    } finally {
      window.clearTimeout(timeout);
      renderDownloadState();
    }
  }

  langButton?.addEventListener('click', () => {
    applyLanguage(currentLanguage === 'he' ? 'en' : 'he');
  });

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    siteNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    const icon = menuToggle.querySelector('use');
    if (icon) icon.setAttribute('href', open ? '#i-close' : '#i-menu');
  });

  siteNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open navigation');
      const icon = menuToggle?.querySelector('use');
      if (icon) icon.setAttribute('href', '#i-menu');
    });
  });

  document.querySelectorAll('.faq-list details').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-list details[open]').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
  applyLanguage(currentLanguage);
  loadLatestInstaller();
})();