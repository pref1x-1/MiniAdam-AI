(() => {
  'use strict';

  const releaseApi='https://api.github.com/repos/pref1x-1/MiniAdam-AI/releases/latest';
  const releasesPage='https://github.com/pref1x-1/MiniAdam-AI/releases';
  const repoApi='https://api.github.com/repos/pref1x-1/MiniAdam-AI';
  const installerPattern=/^miniadam.*setup.*\.exe$/i;
  const root=document.documentElement;
  const langButton=document.getElementById('lang');
  const downloadButton=document.getElementById('downloadButton');
  const finalDownload=document.getElementById('finalDownload');
  const downloadStatus=document.getElementById('downloadStatus');
  const statusText=downloadStatus?.querySelector('span:last-child');
  const versionBadge=document.getElementById('versionBadge');
  const menuToggle=document.getElementById('menuToggle');
  const siteNav=document.getElementById('siteNav');
  const a11yTrigger=document.getElementById('a11yTrigger');
  const a11yPanel=document.getElementById('a11yPanel');
  const a11yClose=document.getElementById('a11yClose');
  const a11yScale=document.getElementById('a11yScale');
  const a11yFeedback=document.getElementById('a11yFeedback');

  let language='en';
  let releaseAsset=null;
  let releaseInfo=null;
  let downloadState='checking';
  const defaults={scale:1,contrast:false,links:false,readable:false,grayscale:false,motion:false,spacing:false};
  let accessibility={...defaults};

  function readStorage(key,fallback){
    try{const value=localStorage.getItem(key);return value===null?fallback:value}catch{return fallback}
  }
  function writeStorage(key,value){try{localStorage.setItem(key,value)}catch{/* Storage is optional. */}}

  function applyLanguage(next){
    language=next==='en'?'en':'he';
    root.lang=language;
    root.dir=language==='he'?'rtl':'ltr';
    document.querySelectorAll('[data-he][data-en]').forEach(node=>{
      const value=node.dataset[language];
      if(value!==undefined)node.innerHTML=value;
    });
    if(langButton){
      const code=langButton.querySelector('.language-code');
      if(code)code.textContent=language==='en'?'HE':'EN';
      langButton.setAttribute('aria-label',language==='en'?'Switch to Hebrew':'Switch to English');
    }
    renderDownload();
    a11yTrigger?.setAttribute('aria-label',language==='he'?'פתח תפריט נגישות':'Open accessibility menu');
    a11yClose?.setAttribute('aria-label',language==='he'?'סגירת תפריט נגישות':'Close accessibility menu');
    menuToggle?.setAttribute('aria-label',language==='he'?'פתח תפריט ניווט':'Open navigation');
    writeStorage('miniadam-site-language-v2',language);
  }

  function normalizeAccessibility(value){
    const next={...defaults};
    if(!value||typeof value!=='object'||Array.isArray(value))return next;
    for(const key of Object.keys(defaults)){
      if(key==='scale')continue;
      next[key]=typeof value[key]==='boolean'?value[key]:false;
    }
    const raw=Number(value.scale);
    const safe=Number.isFinite(raw)?raw:1;
    next.scale=Math.min(1.5,Math.max(1,Math.round(safe*10)/10));
    return next;
  }
  function loadAccessibility(){
    try{accessibility=normalizeAccessibility(JSON.parse(readStorage('miniadam-a11y','null')))}
    catch{accessibility={...defaults}}
    applyAccessibility(false);
  }
  function saveAccessibility(){writeStorage('miniadam-a11y',JSON.stringify(accessibility))}
  function applyAccessibility(announce=true){
    const classes={
      contrast:'a11y-contrast',links:'a11y-links',readable:'a11y-readable-font',
      grayscale:'a11y-grayscale',motion:'a11y-reduced-motion',spacing:'a11y-spacing'
    };
    Object.entries(classes).forEach(([key,className])=>root.classList.toggle(className,!!accessibility[key]));
    accessibility.scale=Math.min(1.5,Math.max(1,Math.round((Number(accessibility.scale)||1)*10)/10));
    root.style.setProperty('--a11y-zoom',String(accessibility.scale));
    if(a11yScale)a11yScale.textContent=Math.round(accessibility.scale*100)+'%';
    const decrease=a11yPanel?.querySelector('[data-a11y-action="decrease"]');
    const increase=a11yPanel?.querySelector('[data-a11y-action="increase"]');
    if(decrease)decrease.disabled=accessibility.scale<=1;
    if(increase)increase.disabled=accessibility.scale>=1.5;
    document.querySelectorAll('[data-a11y-toggle]').forEach(button=>{
      const key=button.dataset.a11yToggle;
      button.setAttribute('aria-pressed',String(!!accessibility[key]));
    });
    saveAccessibility();
    if(announce&&a11yFeedback){
      a11yFeedback.textContent=language==='he'?'העדפות הנגישות עודכנו ונשמרו בדפדפן.':'Accessibility preferences updated and saved in this browser.';
    }
  }
  function openAccessibility(){
    if(!a11yPanel||!a11yTrigger)return;
    a11yPanel.hidden=false;
    a11yTrigger.setAttribute('aria-expanded','true');
    a11yClose?.focus();
  }
  function closeAccessibility(returnFocus=true){
    if(!a11yPanel||!a11yTrigger)return;
    a11yPanel.hidden=true;
    a11yTrigger.setAttribute('aria-expanded','false');
    if(returnFocus)a11yTrigger.focus();
  }

  function formatBytes(bytes){
    if(!Number.isFinite(bytes)||bytes<=0)return '';
    return bytes>=1024*1024?(bytes/(1024*1024)).toFixed(1)+' MB':Math.round(bytes/1024)+' KB';
  }
  function updateStatus(){
    if(!downloadStatus||!statusText)return;
    const messages={
      checking:{he:'בודק את המתקין הרשמי…',en:'Checking the official installer…'},
      available:{he:releaseAsset?'המתקין זמין · '+formatBytes(releaseAsset.size)+' · הורדה מאובטחת מ־GitHub':'המתקין זמין ב־GitHub Releases',en:releaseAsset?'Installer available · '+formatBytes(releaseAsset.size)+' · hosted on GitHub':'Installer available on GitHub Releases'},
      missing:{he:'לא נמצא מתקין בגרסה האחרונה. ניתן לעיין בכל הגרסאות.',en:'No installer was found in the latest release. Browse all releases.'},
      error:{he:'לא ניתן לבדוק כרגע את GitHub. אפשר לעבור לעמוד הגרסאות.',en:'GitHub could not be checked right now. Open the Releases page.'}
    };
    statusText.textContent=messages[downloadState][language];
    downloadStatus.dataset.state=downloadState;
  }
  function renderDownload(){
    if(!downloadButton||!finalDownload)return;
    const available=downloadState==='available'&&releaseAsset?.browser_download_url;
    const url=available?releaseAsset.browser_download_url:releasesPage;
    downloadButton.href=url;
    finalDownload.href=url;
    const version=available?((releaseAsset.name.match(/(\d+\.\d+(?:\.\d+){1,2})/)||[])[1]||'SETUP'):'SETUP';
    if(versionBadge)versionBadge.textContent='v'+version;
    const productVersion=document.getElementById('productVersionBadge');
    if(productVersion)productVersion.textContent='MINI ADAM '+version;
    downloadButton.title=available?releaseAsset.name:(language==='he'?'פתיחת עמוד הגרסאות':'Open releases page');
    finalDownload.title=downloadButton.title;
    updateStatus();
  }
  async function checkLatestRelease(){
    if(!downloadButton||!finalDownload)return;
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),8000);
    try{
      const response=await fetch(releaseApi,{headers:{Accept:'application/vnd.github+json'},cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error('GitHub API returned '+response.status);
      const release=await response.json();
      const assets=Array.isArray(release.assets)?release.assets:[];
      releaseAsset=assets
        .filter(asset=>asset&&asset.state==='uploaded'&&installerPattern.test(asset.name||'')&&typeof asset.browser_download_url==='string')
        .sort((a,b)=>new Date(b.updated_at||b.created_at||0)-new Date(a.updated_at||a.created_at||0))[0]||null;
      releaseInfo=release;
      downloadState=releaseAsset?'available':'missing';
    }catch(error){
      console.warn('[MINI ADAM] Release lookup failed:',error);
      releaseAsset=null;releaseInfo=null;downloadState='error';
    }finally{
      window.clearTimeout(timeout);
      renderDownload();
      renderIntegrity();
    }
  }


  function renderIntegrity(){
    const hashNode=document.getElementById('integrityHash');
    const nameNode=document.getElementById('integrityAssetName');
    const commandNode=document.getElementById('integrityCommand');
    const copyButton=document.getElementById('copyIntegrityHash');
    const feedback=document.getElementById('integrityFeedback');
    if(!hashNode||!nameNode||!commandNode)return;
    const digest=String(releaseAsset?.digest||'').replace(/^sha256:/i,'').toLowerCase();
    const valid=/^[a-f0-9]{64}$/.test(digest);
    if(releaseAsset?.name)nameNode.textContent=releaseAsset.name;
    if(valid){
      hashNode.textContent=digest;
      commandNode.textContent='Get-FileHash ".\\'+releaseAsset.name+'" -Algorithm SHA256';
      if(copyButton)copyButton.disabled=false;
      if(feedback)feedback.textContent=language==='he'?'הגיבוב נטען מה־Release האחרון ב־GitHub.':'Digest loaded from the latest GitHub Release.';
    }else{
      hashNode.textContent=language==='he'?'לא פורסם גיבוב SHA-256 עבור הקובץ הזה.':'No SHA-256 digest is published for this asset.';
      commandNode.textContent=language==='he'?'לא זמין כרגע':'Not available';
      if(copyButton)copyButton.disabled=true;
      if(feedback)feedback.textContent=language==='he'?'אפשר לפתוח את עמוד ה־Release ולבדוק אם פורסם SHA-256.':'Open the release page to check whether a SHA-256 digest is available.';
    }
  }
  async function checkRepositoryStars(){
    const nodes=[...document.querySelectorAll('[data-github-stars]')];
    if(!nodes.length)return;
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),6500);
    try{
      const response=await fetch(repoApi,{headers:{Accept:'application/vnd.github+json'},signal:controller.signal});
      if(!response.ok)throw new Error('GitHub API returned '+response.status);
      const data=await response.json();
      const count=Number(data.stargazers_count);
      if(!Number.isFinite(count)||count<0)throw new Error('Invalid star count');
      nodes.forEach(node=>node.textContent=count.toLocaleString(language==='he'?'he-IL':'en-US'));
      const link=document.getElementById('githubStarLink');
      link?.setAttribute('aria-label',language==='he'?('MINI ADAM ב־GitHub · '+count+' כוכבים'):('MINI ADAM on GitHub · '+count+' stars'));
    }catch(error){
      console.warn('[MINI ADAM] GitHub star lookup failed:',error);
    }finally{window.clearTimeout(timeout)}
  }
  function initIntegrityCopy(){
    const button=document.getElementById('copyIntegrityHash');
    const target=document.getElementById('integrityHash');
    const feedback=document.getElementById('integrityFeedback');
    button?.addEventListener('click',async()=>{
      const value=target?.textContent?.trim()||'';
      if(!/^[a-f0-9]{64}$/i.test(value))return;
      try{
        await navigator.clipboard.writeText(value);
        if(feedback)feedback.textContent=language==='he'?'הגיבוב הועתק ללוח.':'SHA-256 copied to clipboard.';
      }catch{
        if(feedback)feedback.textContent=language==='he'?'ההעתקה לא נתמכה. אפשר לסמן ולהעתיק את הטקסט ידנית.':'Clipboard access is unavailable. Select and copy the hash manually.';
      }
    });
  }
  function initContact(){
    const form=document.getElementById('contactForm');
    if(!form)return;
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const data=new FormData(form);
      const topic=String(data.get('topic')||'General question').trim();
      const subject=String(data.get('subject')||'').trim();
      const message=String(data.get('message')||'').trim();
      if(!subject||message.length<10)return;
      const title='[Website Contact] '+subject.slice(0,100);
      const body=[
        '### Topic',topic,'',
        '### Message',message,'',
        '---','Sent through the MINI ADAM website contact form.'
      ].join('\n');
      const url='https://github.com/pref1x-1/MiniAdam-AI/issues/new?'+new URLSearchParams({title,body}).toString();
      window.location.assign(url);
    });
  }

  function initNavigation(){
    menuToggle?.addEventListener('click',()=>{
      const open=menuToggle.getAttribute('aria-expanded')!=='true';
      menuToggle.setAttribute('aria-expanded',String(open));
      siteNav?.classList.toggle('is-open',open);
      menuToggle.setAttribute('aria-label',language==='he'?(open?'סגור תפריט ניווט':'פתח תפריט ניווט'):(open?'Close navigation':'Open navigation'));
      const menuIcon=menuToggle.querySelector('.icon');
      if(menuIcon)menuIcon.textContent=open?'close':'menu';
    });
    siteNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      siteNav.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded','false');
      menuToggle?.setAttribute('aria-label',language==='he'?'פתח תפריט ניווט':'Open navigation');
      const menuIcon=menuToggle?.querySelector('.icon');
      if(menuIcon)menuIcon.textContent='menu';
    }));
  }
  function initAccessibility(){
    if(!a11yTrigger||!a11yPanel)return;
    a11yTrigger.addEventListener('click',()=>{
      const open=a11yTrigger.getAttribute('aria-expanded')==='true';
      if(open)closeAccessibility(false);else openAccessibility();
    });
    a11yClose?.addEventListener('click',()=>closeAccessibility(true));
    a11yPanel.addEventListener('click',event=>{
      const target=event.target instanceof Element?event.target:null;
      const toggle=target?.closest('[data-a11y-toggle]');
      const action=target?.closest('[data-a11y-action]');
      if(toggle){
        const key=toggle.dataset.a11yToggle;
        if(Object.prototype.hasOwnProperty.call(accessibility,key)){
          accessibility[key]=!accessibility[key];
          applyAccessibility();
        }
      }
      if(action){
        switch(action.dataset.a11yAction){
          case 'increase':accessibility.scale=Math.min(1.5,Math.round((accessibility.scale+.1)*10)/10);break;
          case 'decrease':accessibility.scale=Math.max(1,Math.round((accessibility.scale-.1)*10)/10);break;
          case 'reset':accessibility={...defaults};break;
        }
        applyAccessibility();
      }
    });
    document.addEventListener('keydown',event=>{
      if(a11yPanel.hidden)return;
      if(event.key==='Escape'){
        event.preventDefault();
        closeAccessibility(true);
        return;
      }
      if(event.key!=='Tab')return;
      const focusable=[...a11yPanel.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')]
        .filter(el=>!el.hidden&&el.getAttribute('aria-hidden')!=='true');
      if(!focusable.length){event.preventDefault();a11yPanel.focus();return}
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
      else if(!a11yPanel.contains(document.activeElement)){event.preventDefault();first.focus()}
    });
    document.addEventListener('pointerdown',event=>{
      if(a11yPanel.hidden)return;
      if(a11yTrigger.contains(event.target))return;
      if(!a11yPanel.contains(event.target))closeAccessibility(false);
    });
    loadAccessibility();
  }

  function initReveal(){
    const items=[...document.querySelectorAll('[data-reveal]')];
    if(!items.length)return;
    if(!('IntersectionObserver'in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(item=>item.classList.add('is-visible'));return}
    root.classList.add('js-ready');
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    items.forEach(item=>observer.observe(item));
  }
  function initParallax(){
    const stage=document.getElementById('deviceStage');
    if(!stage||root.classList.contains('a11y-reduced-motion')||!window.matchMedia('(pointer:fine)').matches||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const visual=stage.closest('.hero-visual');
    visual?.addEventListener('pointermove',event=>{
      const rect=visual.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      stage.style.setProperty('--tilt-y',(x*2.5).toFixed(2)+'deg');
      stage.style.setProperty('--tilt-x',(-y*1.5).toFixed(2)+'deg');
    });
    visual?.addEventListener('pointerleave',()=>{
      stage.style.setProperty('--tilt-x','0deg');
      stage.style.setProperty('--tilt-y','0deg');
    });
  }
  function initFaq(){
    document.querySelectorAll('.faq-list details').forEach(item=>{
      item.addEventListener('toggle',()=>{
        if(!item.open)return;
        document.querySelectorAll('.faq-list details[open]').forEach(other=>{if(other!==item)other.open=false});
      });
    });
  }

  langButton?.addEventListener('click',()=>applyLanguage(language==='he'?'en':'he'));
  language=readStorage('miniadam-site-language-v2','en')==='he'?'he':'en';
  applyLanguage(language);
  initNavigation();
  initAccessibility();
  initReveal();
  initParallax();
  initFaq();
  initIntegrityCopy();
  initContact();
  checkRepositoryStars();
  checkLatestRelease();
})();