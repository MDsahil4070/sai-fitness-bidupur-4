/* =========================================================
   SAI FITNESS ADMIN CORE
   Final Integration Engine
   ========================================================= */

(function(){

"use strict";

/* ---------------------------------------------------------
   CONFIG
--------------------------------------------------------- */

const CONFIG = {
    appName: "Sai Fitness Bidupur",
    version: "1.0.0",

    storage: {
        content: "saiAppContent",
        home: "saiHomeSettings",
        theme: "saiCustomTheme",
        themeEnabled: "saiThemeEnabled",
        pageBuilder: "saiPageBuilder",
        seo: "saiAdminSEO",
        pwa: "saiPWASettings",
        maintenance: "saiMaintenanceSettings",
        css: "saiCSSManager",
        animations: "saiAnimationManager",
        version: "saiVersionManager"
    }
};

/* ---------------------------------------------------------
   STORAGE HELPERS
--------------------------------------------------------- */

function read(key,fallback=null){

    try{

        const raw =
            localStorage.getItem(key);

        if(raw === null){
            return fallback;
        }

        try{
            return JSON.parse(raw);
        }catch(e){
            return raw;
        }

    }catch(e){

        return fallback;
    }
}

function write(key,value){

    try{

        localStorage.setItem(
            key,
            typeof value === "string"
            ? value
            : JSON.stringify(value)
        );

        return true;

    }catch(e){

        return false;
    }
}

/* ---------------------------------------------------------
   CONTENT
--------------------------------------------------------- */

function getContent(){

    return read(
        CONFIG.storage.content,
        {
            appName:"Sai Fitness Bidupur",
            tagline:"Train Hard • Stay Strong",
            heroTitle:"Let's Build Your Best Body",
            heroSubtitle:
                "Track your workouts, nutrition and progress every day.",
            motivation:
                "Small progress every day becomes big results.",
            announcement:
                "New workout plan available!",
            showAnnouncement:true,
            about:
                "Sai Fitness Bidupur is your personal fitness companion.",
            owner:"Sai Fitness Bidupur",
            phone:"",
            email:"",
            address:"Bidupur, Bihar",
            footerText:
                "© 2026 Sai Fitness Bidupur. All rights reserved.",
            version:"1.0.0"
        }
    );
}

function saveContent(data){

    return write(
        CONFIG.storage.content,
        data
    );
}

/* ---------------------------------------------------------
   HOME SETTINGS
--------------------------------------------------------- */

function getHome(){

    return read(
        CONFIG.storage.home,
        {
            showWorkouts:true,
            showQuickActions:true,
            showWater:true,
            showDiet:true,
            showRecentActivity:true,
            showMotivation:true,
            showAnnouncement:true
        }
    );
}

/* ---------------------------------------------------------
   THEME
--------------------------------------------------------- */

function getTheme(){

    return read(
        CONFIG.storage.theme,
        {
            primary:"#16a34a",
            background:"#070b09",
            card:"#101713",
            text:"#f5f7f6",
            radius:18
        }
    );
}

function isThemeEnabled(){

    return read(
        CONFIG.storage.themeEnabled,
        false
    );
}

/* ---------------------------------------------------------
   PAGE BUILDER
--------------------------------------------------------- */

function getPageBuilder(){

    return read(
        CONFIG.storage.pageBuilder,
        []
    );
}

/* ---------------------------------------------------------
   SEO
--------------------------------------------------------- */

function getSEO(){

    return read(
        CONFIG.storage.seo,
        {}
    );
}

/* ---------------------------------------------------------
   MAINTENANCE
--------------------------------------------------------- */

function getMaintenance(){

    return read(
        CONFIG.storage.maintenance,
        {
            enabled:false,
            mode:"manual",
            title:"We'll Be Back Soon",
            message:
                "Sai Fitness is temporarily unavailable.",
            showNotice:true,
            adminBypass:true
        }
    );
}

/* ---------------------------------------------------------
   VERSION
--------------------------------------------------------- */

function getVersion(){

    return read(
        CONFIG.storage.version,
        {
            currentVersion:
                getContent().version || CONFIG.version,
            status:"stable"
        }
    );
}

/* ---------------------------------------------------------
   APPLY THEME
--------------------------------------------------------- */

function applyTheme(){

    const enabled =
        isThemeEnabled();

    if(!enabled){
        return;
    }

    const theme =
        getTheme();

    const root =
        document.documentElement;

    if(theme.primary){
        root.style.setProperty(
            "--primary",
            theme.primary
        );
    }

    if(theme.background){
        root.style.setProperty(
            "--background",
            theme.background
        );
    }

    if(theme.card){
        root.style.setProperty(
            "--card",
            theme.card
        );
    }

    if(theme.text){
        root.style.setProperty(
            "--text",
            theme.text
        );
    }

    if(theme.radius){
        root.style.setProperty(
            "--radius",
            theme.radius + "px"
        );
    }
}

/* ---------------------------------------------------------
   APPLY SEO
--------------------------------------------------------- */

function applySEO(){

    const seo =
        getSEO();

    if(!seo || typeof seo !== "object"){
        return;
    }

    if(seo.title){

        document.title =
            seo.title;
    }

    setMeta(
        "description",
        seo.description
    );

    setMeta(
        "keywords",
        seo.keywords
    );

    setMeta(
        "robots",
        seo.robots
    );

    if(seo.language){

        document.documentElement.lang =
            seo.language;
    }

    if(seo.canonical){

        let canonical =
            document.querySelector(
                'link[rel="canonical"]'
            );

        if(!canonical){

            canonical =
                document.createElement("link");

            canonical.rel =
                "canonical";

            document.head.appendChild(
                canonical
            );
        }

        canonical.href =
            seo.canonical;
    }

    if(seo.ogTitle){

        setProperty(
            "og:title",
            seo.ogTitle
        );
    }

    if(seo.ogDescription){

        setProperty(
            "og:description",
            seo.ogDescription
        );
    }

    if(seo.ogImage){

        setProperty(
            "og:image",
            seo.ogImage
        );
    }
}

function setMeta(name,content){

    if(!content){
        return;
    }

    let meta =
        document.querySelector(
            `meta[name="${name}"]`
        );

    if(!meta){

        meta =
            document.createElement("meta");

        meta.name =
            name;

        document.head.appendChild(
            meta
        );
    }

    meta.content =
        content;
}

function setProperty(property,content){

    if(!content){
        return;
    }

    let meta =
        document.querySelector(
            `meta[property="${property}"]`
        );

    if(!meta){

        meta =
            document.createElement("meta");

        meta.setAttribute(
            "property",
            property
        );

        document.head.appendChild(
            meta
        );
    }

    meta.content =
        content;
}

/* ---------------------------------------------------------
   DYNAMIC CONTENT
--------------------------------------------------------- */

function applyContent(){

    const content =
        getContent();

    const map = {

        "[data-app-name]":
            content.appName,

        "[data-app-tagline]":
            content.tagline,

        "[data-hero-title]":
            content.heroTitle,

        "[data-hero-subtitle]":
            content.heroSubtitle,

        "[data-motivation]":
            content.motivation,

        "[data-announcement]":
            content.announcement,

        "[data-about]":
            content.about,

        "[data-owner]":
            content.owner,

        "[data-phone]":
            content.phone,

        "[data-email]":
            content.email,

        "[data-address]":
            content.address,

        "[data-footer]":
            content.footerText,

        "[data-version]":
            content.version
    };

    Object.keys(map).forEach(selector=>{

        document
            .querySelectorAll(selector)
            .forEach(element=>{

                element.textContent =
                    map[selector] ?? "";

            });
    });

    document
        .querySelectorAll(
            "[data-announcement]"
        )
        .forEach(element=>{

            if(content.showAnnouncement === false){

                element.style.display =
                    "none";
            }
        });
}

/* ---------------------------------------------------------
   CUSTOM CSS MANAGER
--------------------------------------------------------- */

function applyCustomCSS(){

    const data =
        read(
            CONFIG.storage.css,
            null
        );

    if(!data){
        return;
    }

    let css = "";

    if(typeof data === "string"){

        css = data;

    }else if(data.enabled === false){

        return;

    }else{

        css =
            data.css ||
            data.code ||
            data.customCSS ||
            "";
    }

    if(!css){
        return;
    }

    let style =
        document.getElementById(
            "sai-admin-custom-css"
        );

    if(!style){

        style =
            document.createElement("style");

        style.id =
            "sai-admin-custom-css";

        document.head.appendChild(
            style
        );
    }

    style.textContent =
        css;
}

/* ---------------------------------------------------------
   CUSTOM ANIMATION MANAGER
--------------------------------------------------------- */

function applyCustomAnimations(){

    const data =
        read(
            CONFIG.storage.animations,
            null
        );

    if(!data){
        return;
    }

    if(
        typeof data === "object" &&
        data.enabled === false
    ){
        return;
    }

    let css = "";

    if(typeof data === "string"){

        css = data;

    }else{

        css =
            data.css ||
            data.code ||
            data.customCSS ||
            "";
    }

    if(!css){
        return;
    }

    let style =
        document.getElementById(
            "sai-admin-animation-css"
        );

    if(!style){

        style =
            document.createElement("style");

        style.id =
            "sai-admin-animation-css";

        document.head.appendChild(
            style
        );
    }

    style.textContent =
        css;
}

/* ---------------------------------------------------------
   MAINTENANCE CHECK
--------------------------------------------------------- */

function checkMaintenance(){

    const settings =
        getMaintenance();

    if(!settings.enabled){
        return false;
    }

    /*
      Admin pages are never blocked here.
      User pages can use SaiAdminCore.isMaintenance().
    */

    return true;
}

function isMaintenance(){

    return checkMaintenance();
}

/* ---------------------------------------------------------
   VERSION
--------------------------------------------------------- */

function getAppVersion(){

    const version =
        getVersion();

    return (
        version.currentVersion ||
        getContent().version ||
        CONFIG.version
    );
}

/* ---------------------------------------------------------
   GLOBAL STATUS
--------------------------------------------------------- */

function getSystemStatus(){

    return {

        appName:
            getContent().appName,

        version:
            getAppVersion(),

        theme:
            isThemeEnabled(),

        maintenance:
            isMaintenance(),

        seo:
            Object.keys(
                getSEO()
            ).length > 0,

        pageBuilder:
            Array.isArray(
                getPageBuilder()
            ),

        home:
            !!getHome()
    };
}

/* ---------------------------------------------------------
   EXPORT
--------------------------------------------------------- */

window.SaiAdminCore = {

    config:CONFIG,

    read,
    write,

    getContent,
    saveContent,

    getHome,

    getTheme,
    isThemeEnabled,

    getPageBuilder,

    getSEO,

    getMaintenance,

    getVersion,
    getAppVersion,

    applyTheme,
    applySEO,
    applyContent,

    applyCustomCSS,
    applyCustomAnimations,

    isMaintenance,

    getSystemStatus
};

/* ---------------------------------------------------------
   AUTO START
--------------------------------------------------------- */

function boot(){

    applyTheme();
    applySEO();
    applyContent();
    applyCustomCSS();
    applyCustomAnimations();

}

if(
    document.readyState === "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        boot
    );

}else{

    boot();
}

})();