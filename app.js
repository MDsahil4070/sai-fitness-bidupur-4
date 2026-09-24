/* =========================================================
   SAI FITNESS BIDUPUR
   GLOBAL APP ENGINE + GLOBAL SEO ENGINE
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function loadJSON(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch (error) {
        console.warn("Storage read error:", key, error);
        return fallback;
    }
}

function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn("Storage save error:", key, error);
        return false;
    }
}

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn("Storage remove error:", key, error);
    }
}


/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
    notifications: true,
    vibration: true,
    sound: true,
    darkMode: true,
    weightUnit: "kg",
    heightUnit: "cm"
};

const DEFAULT_FITNESS_DATA = {
    workouts: 0,
    calories: 0,
    minutes: 0,
    streak: 0,
    lastWorkoutDate: null
};

const DEFAULT_CONTENT = {
    appName: "Sai Fitness Bidupur",
    tagline: "Train Hard • Stay Strong",
    heroTitle: "Let's Build Your Best Body",
    heroSubtitle:
        "Track your workouts, nutrition and progress every day.",
    motivation:
        "Small progress every day becomes big results.",
    announcement:
        "New workout plan available!",
    showAnnouncement: true,
    about:
        "Sai Fitness Bidupur is your personal fitness companion. Track workouts, nutrition, body measurements, goals and progress in one simple app.",
    owner: "Sai Fitness Bidupur",
    phone: "",
    email: "",
    address: "Bidupur, Bihar",
    footerText:
        "© 2026 Sai Fitness Bidupur. All rights reserved.",
    version: "1.0.0"
};

const DEFAULT_THEME = {
    primary: "#16a34a",
    background: "#070b09",
    card: "#101713",
    text: "#f5f7f6",
    radius: 18
};


/* =========================================================
   DEFAULT SEO
   ========================================================= */

const DEFAULT_SEO = {
    seoTitle: "Sai Fitness Bidupur | Fitness & Workout",
    metaDescription:
        "Sai Fitness Bidupur - Track workouts, fitness progress, calories, goals, diet and daily activity.",
    keywords:
        "Sai Fitness Bidupur, fitness, workout, gym, exercise, fitness tracker, Bihar",
    websiteUrl: "",
    canonicalUrl: "",
    robots: "index, follow",
    language: "en-IN",

    ogTitle: "Sai Fitness Bidupur",
    ogDescription:
        "Your personal fitness and workout companion.",
    ogImage: "",
    ogUrl: "",
    ogType: "website",

    twitterCard: "summary_large_image",
    twitterTitle: "Sai Fitness Bidupur",
    twitterDescription:
        "Track workouts, diet, calories, goals and fitness progress.",
    twitterImage: "",

    googleVerification: "",
    sitemapUrl: "",
    robotsTxtUrl: "",

    schemaName: "Sai Fitness Bidupur",
    schemaType: "WebApplication",
    schemaDescription:
        "Personal fitness and workout companion.",
    schemaLogo: ""
};


/* =========================================================
   SETTINGS
   ========================================================= */

function getAppSettings() {
    const saved = loadJSON("saiAppSettings", {});
    return {
        ...DEFAULT_SETTINGS,
        ...(saved || {})
    };
}

function saveAppSettings(settings) {
    const merged = {
        ...DEFAULT_SETTINGS,
        ...(settings || {})
    };

    saveJSON("saiAppSettings", merged);

    applyGlobalSettings();

    return merged;
}


/* =========================================================
   FITNESS DATA
   ========================================================= */

function getFitnessData() {
    const saved = loadJSON(
        "saiFitnessData",
        {}
    );

    return {
        ...DEFAULT_FITNESS_DATA,
        ...(saved || {})
    };
}

function saveFitnessData(data) {
    const merged = {
        ...DEFAULT_FITNESS_DATA,
        ...(data || {})
    };

    saveJSON("saiFitnessData", merged);

    return merged;
}


/* =========================================================
   APP CONTENT
   ========================================================= */

function getAppContent() {
    const saved = loadJSON(
        "saiAppContent",
        {}
    );

    return {
        ...DEFAULT_CONTENT,
        ...(saved || {})
    };
}

function saveAppContent(content) {
    const merged = {
        ...DEFAULT_CONTENT,
        ...(content || {})
    };

    saveJSON("saiAppContent", merged);

    applyGlobalContent();
    applyGlobalSEO();

    return merged;
}


/* =========================================================
   THEME
   ========================================================= */

function getSavedTheme() {
    const saved = loadJSON(
        "saiCustomTheme",
        {}
    );

    return {
        ...DEFAULT_THEME,
        ...(saved || {})
    };
}

function applyGlobalTheme() {
    const theme = getSavedTheme();

    const root = document.documentElement;

    if (!root) return;

    root.style.setProperty(
        "--primary",
        theme.primary
    );

    root.style.setProperty(
        "--primary-color",
        theme.primary
    );

    root.style.setProperty(
        "--bg",
        theme.background
    );

    root.style.setProperty(
        "--background",
        theme.background
    );

    root.style.setProperty(
        "--card",
        theme.card
    );

    root.style.setProperty(
        "--card-bg",
        theme.card
    );

    root.style.setProperty(
        "--text",
        theme.text
    );

    root.style.setProperty(
        "--text-color",
        theme.text
    );

    root.style.setProperty(
        "--radius",
        `${theme.radius}px`
    );

    document.body?.style.setProperty(
        "background-color",
        theme.background
    );

    const themeColor = document.querySelector(
        'meta[name="theme-color"]'
    );

    if (themeColor) {
        themeColor.setAttribute(
            "content",
            theme.background
        );
    }
}


/* =========================================================
   GLOBAL CONTENT ENGINE
   ========================================================= */

function applyGlobalContent() {
    const content = getAppContent();

    const mappings = {
        "[data-app-name]": content.appName,
        "[data-app-tagline]": content.tagline,
        "[data-hero-title]": content.heroTitle,
        "[data-hero-subtitle]": content.heroSubtitle,
        "[data-motivation]": content.motivation,
        "[data-announcement]": content.announcement,
        "[data-about]": content.about,
        "[data-owner]": content.owner,
        "[data-phone]": content.phone,
        "[data-email]": content.email,
        "[data-address]": content.address,
        "[data-footer]": content.footerText,
        "[data-version]": content.version
    };

    Object.keys(mappings).forEach(selector => {
        const value = mappings[selector];

        document.querySelectorAll(selector).forEach(element => {
            element.textContent =
                value ?? "";
        });
    });

    document
        .querySelectorAll("[data-announcement-box]")
        .forEach(box => {
            box.style.display =
                content.showAnnouncement
                    ? ""
                    : "none";
        });
}


/* =========================================================
   GLOBAL LOGO ENGINE
   ========================================================= */

function applyGlobalLogo() {
    const logo =
        localStorage.getItem("saiMediaLogo") || "";

    if (!logo) return;

    document
        .querySelectorAll(
            "[data-app-logo], .app-logo img, .brand-logo img"
        )
        .forEach(img => {
            if (img.tagName === "IMG") {
                img.src = logo;
            } else {
                img.style.backgroundImage =
                    `url("${logo}")`;
            }
        });

    document
        .querySelectorAll("[data-default-avatar]")
        .forEach(img => {
            if (img.tagName === "IMG") {
                img.src = logo;
            }
        });
}


/* =========================================================
   GLOBAL HOME BANNER
   ========================================================= */

function applyGlobalBanner() {
    const banner =
        localStorage.getItem("saiMediaBanner") || "";

    if (!banner) return;

    document
        .querySelectorAll("[data-home-banner]")
        .forEach(element => {
            if (
                element.tagName === "IMG"
            ) {
                element.src = banner;
            } else {
                element.style.backgroundImage =
                    `url("${banner}")`;
            }
        });
}


/* =========================================================
   SEO HELPERS
   ========================================================= */

function getSEOSettings() {
    const saved = loadJSON(
        "saiAdminSEO",
        {}
    );

    return {
        ...DEFAULT_SEO,
        ...(saved || {})
    };
}


function ensureMeta(name, content) {
    if (!content) return;

    let meta = document.querySelector(
        `meta[name="${name}"]`
    );

    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
    }

    meta.setAttribute(
        "content",
        content
    );
}


function ensureMetaProperty(property, content) {
    if (!content) return;

    let meta = document.querySelector(
        `meta[property="${property}"]`
    );

    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(
            "property",
            property
        );
        document.head.appendChild(meta);
    }

    meta.setAttribute(
        "content",
        content
    );
}


function ensureCanonical(url) {
    if (!url) return;

    let link = document.querySelector(
        'link[rel="canonical"]'
    );

    if (!link) {
        link = document.createElement("link");
        link.setAttribute(
            "rel",
            "canonical"
        );
        document.head.appendChild(link);
    }

    link.setAttribute(
        "href",
        url
    );
}


/* =========================================================
   GLOBAL SEO ENGINE
   ========================================================= */

function applyGlobalSEO() {
    if (!document.head) return;

    const seo = getSEOSettings();
    const content = getAppContent();

    /* -----------------------------------------
       TITLE
       ----------------------------------------- */

    const title =
        seo.seoTitle ||
        content.appName ||
        DEFAULT_SEO.seoTitle;

    document.title = title;


    /* -----------------------------------------
       BASIC META
       ----------------------------------------- */

    ensureMeta(
        "description",
        seo.metaDescription
    );

    ensureMeta(
        "keywords",
        seo.keywords
    );

    ensureMeta(
        "robots",
        seo.robots
    );


    /* -----------------------------------------
       LANGUAGE
       ----------------------------------------- */

    if (seo.language) {
        document.documentElement.lang =
            seo.language;
    }


    /* -----------------------------------------
       CANONICAL
       ----------------------------------------- */

    let canonical =
        seo.canonicalUrl ||
        seo.websiteUrl ||
        "";

    if (
        !canonical &&
        window.location.protocol !== "file:"
    ) {
        canonical =
            window.location.href.split("#")[0];
    }

    if (canonical) {
        ensureCanonical(canonical);
    }


    /* -----------------------------------------
       GOOGLE VERIFICATION
       ----------------------------------------- */

    if (seo.googleVerification) {
        ensureMeta(
            "google-site-verification",
            seo.googleVerification
        );
    }


    /* -----------------------------------------
       OPEN GRAPH
       ----------------------------------------- */

    ensureMetaProperty(
        "og:title",
        seo.ogTitle ||
        title
    );

    ensureMetaProperty(
        "og:description",
        seo.ogDescription ||
        seo.metaDescription
    );

    ensureMetaProperty(
        "og:type",
        seo.ogType ||
        "website"
    );

    if (
        seo.ogUrl ||
        canonical
    ) {
        ensureMetaProperty(
            "og:url",
            seo.ogUrl ||
            canonical
        );
    }

    if (seo.ogImage) {
        ensureMetaProperty(
            "og:image",
            seo.ogImage
        );
    }


    /* -----------------------------------------
       TWITTER CARD
       ----------------------------------------- */

    ensureMeta(
        "twitter:card",
        seo.twitterCard ||
        "summary_large_image"
    );

    ensureMeta(
        "twitter:title",
        seo.twitterTitle ||
        title
    );

    ensureMeta(
        "twitter:description",
        seo.twitterDescription ||
        seo.metaDescription
    );

    if (seo.twitterImage) {
        ensureMeta(
            "twitter:image",
            seo.twitterImage
        );
    }


    /* -----------------------------------------
       THEME COLOR
       ----------------------------------------- */

    const theme =
        getSavedTheme();

    ensureMeta(
        "theme-color",
        theme.background
    );


    /* -----------------------------------------
       JSON-LD STRUCTURED DATA
       ----------------------------------------- */

    let schemaScript =
        document.getElementById(
            "sai-global-schema"
        );

    if (!schemaScript) {
        schemaScript =
            document.createElement(
                "script"
            );

        schemaScript.type =
            "application/ld+json";

        schemaScript.id =
            "sai-global-schema";

        document.head.appendChild(
            schemaScript
        );
    }

    const schema = {
        "@context":
            "https://schema.org",
        "@type":
            seo.schemaType ||
            "WebApplication",
        "name":
            seo.schemaName ||
            content.appName,
        "description":
            seo.schemaDescription ||
            seo.metaDescription,
        "applicationCategory":
            "HealthApplication",
        "operatingSystem":
            "Android, iOS, Web"
    };

    if (seo.schemaLogo) {
        schema.logo =
            seo.schemaLogo;
    }

    if (
        seo.websiteUrl
    ) {
        schema.url =
            seo.websiteUrl;
    }

    schemaScript.textContent =
        JSON.stringify(
            schema,
            null,
            2
        );
}


/* =========================================================
   GLOBAL SETTINGS ENGINE
   ========================================================= */

function applyGlobalSettings() {
    applyGlobalTheme();
    applyGlobalContent();
    applyGlobalLogo();
    applyGlobalBanner();
    applyGlobalSEO();
}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function getTodayKey() {
    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getDateDifference(
    date1,
    date2
) {
    const a =
        new Date(date1);

    const b =
        new Date(date2);

    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);

    return Math.round(
        Math.abs(
            b - a
        ) /
        (1000 * 60 * 60 * 24)
    );
}


/* =========================================================
   STREAK ENGINE
   ========================================================= */

function updateWorkoutStreak() {
    const data =
        getFitnessData();

    const today =
        getTodayKey();

    if (!data.lastWorkoutDate) {
        data.streak = 1;
        data.lastWorkoutDate =
            today;

        saveFitnessData(data);

        return data;
    }

    if (
        data.lastWorkoutDate ===
        today
    ) {
        return data;
    }

    const difference =
        getDateDifference(
            data.lastWorkoutDate,
            today
        );

    if (difference === 1) {
        data.streak =
            Number(data.streak || 0) +
            1;
    } else {
        data.streak = 1;
    }

    data.lastWorkoutDate =
        today;

    saveFitnessData(data);

    return data;
}


/* =========================================================
   WORKOUT COMPLETION
   ========================================================= */

function completeWorkout(
    calories = 0,
    minutes = 0,
    workoutName = "Workout"
) {
    const data =
        getFitnessData();

    data.workouts =
        Number(data.workouts || 0) + 1;

    data.calories =
        Number(data.calories || 0) +
        Number(calories || 0);

    data.minutes =
        Number(data.minutes || 0) +
        Number(minutes || 0);

    updateWorkoutStreak();

    const history =
        loadJSON(
            "saiWorkoutHistory",
            []
        );

    history.unshift({
        id:
            Date.now(),
        name:
            workoutName,
        calories:
            Number(calories || 0),
        minutes:
            Number(minutes || 0),
        date:
            new Date().toISOString()
    });

    saveJSON(
        "saiWorkoutHistory",
        history.slice(0, 100)
    );

    saveFitnessData(
        getFitnessData()
    );

    vibrate(60);
    playSound("success");

    showToast(
        "Workout completed! 💪"
    );

    updateDashboard();

    return getFitnessData();
}


/* =========================================================
   WATER ENGINE
   ========================================================= */

function getWaterData() {
    return loadJSON(
        "saiWater",
        {
            current: 0,
            target: 8
        }
    );
}

function saveWaterData(data) {
    saveJSON(
        "saiWater",
        data
    );

    return data;
}

function addWater(amount = 1) {
    const water =
        getWaterData();

    water.current =
        Math.max(
            0,
            Number(water.current || 0) +
            Number(amount || 0)
        );

    saveWaterData(water);

    const history =
        loadJSON(
            "saiWaterHistory",
            []
        );

    history.push({
        amount:
            Number(amount || 0),
        date:
            new Date().toISOString()
    });

    saveJSON(
        "saiWaterHistory",
        history.slice(-200)
    );

    vibrate(30);

    showToast(
        `Water added: ${amount} glass`
    );

    return water;
}


/* =========================================================
   WORKOUT HISTORY
   ========================================================= */

function getWorkoutHistory() {
    return loadJSON(
        "saiWorkoutHistory",
        []
    );
}

function clearWorkoutHistory() {
    removeStorage(
        "saiWorkoutHistory"
    );

    showToast(
        "Workout history cleared"
    );
}


/* =========================================================
   COMPLETED EXERCISES
   ========================================================= */

function getCompletedExercises() {
    return loadJSON(
        "saiCompletedExercises",
        []
    );
}

function markExerciseComplete(
    exerciseId
) {
    const completed =
        getCompletedExercises();

    if (
        !completed.includes(
            exerciseId
        )
    ) {
        completed.push(
            exerciseId
        );
    }

    saveJSON(
        "saiCompletedExercises",
        completed
    );

    vibrate(40);

    return completed;
}


/* =========================================================
   SELECTED EXERCISE
   ========================================================= */

function selectExercise(exercise) {
    saveJSON(
        "saiSelectedExercise",
        exercise
    );

    return exercise;
}

function getSelectedExercise() {
    return loadJSON(
        "saiSelectedExercise",
        null
    );
}


/* =========================================================
   USER PROFILE
   ========================================================= */

function getProfileData() {
    return loadJSON(
        "saiProfileData",
        {
            name: "Sai",
            age: "",
            gender: "",
            weight: "",
            height: "",
            goal: ""
        }
    );
}

function saveProfileData(data) {
    saveJSON(
        "saiProfileData",
        data
    );

    return data;
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    duration = 2200
) {
    let toast =
        document.getElementById(
            "sai-global-toast"
        );

    if (!toast) {
        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "sai-global-toast";

        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "90px";

        toast.style.transform =
            "translateX(-50%) translateY(20px)";

        toast.style.zIndex =
            "99999";

        toast.style.padding =
            "12px 18px";

        toast.style.borderRadius =
            "14px";

        toast.style.background =
            "rgba(16,23,19,.96)";

        toast.style.color =
            "#fff";

        toast.style.fontSize =
            "14px";

        toast.style.fontWeight =
            "600";

        toast.style.border =
            "1px solid rgba(255,255,255,.08)";

        toast.style.boxShadow =
            "0 12px 35px rgba(0,0,0,.35)";

        toast.style.transition =
            "all .25s ease";

        document.body.appendChild(
            toast
        );
    }

    toast.textContent =
        message;

    toast.style.opacity =
        "1";

    toast.style.transform =
        "translateX(-50%) translateY(0)";

    clearTimeout(
        toast._timer
    );

    toast._timer =
        setTimeout(() => {
            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(-50%) translateY(20px)";
        }, duration);
}


/* =========================================================
   VIBRATION
   ========================================================= */

function vibrate(pattern = 30) {
    const settings =
        getAppSettings();

    if (
        !settings.vibration
    ) return;

    if (
        "vibrate" in navigator
    ) {
        try {
            navigator.vibrate(
                pattern
            );
        } catch (error) {}
    }
}


/* =========================================================
   SOUND
   ========================================================= */

function playSound(
    type = "click"
) {
    const settings =
        getAppSettings();

    if (!settings.sound)
        return;

    try {
        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext)
            return;

        const ctx =
            new AudioContext();

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.connect(
            gain
        );

        gain.connect(
            ctx.destination
        );

        if (type === "success") {
            oscillator.frequency.value =
                720;
        } else {
            oscillator.frequency.value =
                480;
        }

        gain.gain.value =
            0.035;

        oscillator.start();

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.12
        );

        oscillator.stop(
            ctx.currentTime + 0.12
        );
    } catch (error) {
        console.warn(
            "Sound unavailable"
        );
    }
}


/* =========================================================
   NUMBER HELPERS
   ========================================================= */

function safeNumber(
    value,
    fallback = 0
) {
    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


/* =========================================================
   DASHBOARD UPDATE
   ========================================================= */

function updateDashboard() {
    const data =
        getFitnessData();

    const mappings = {
        "[data-stat-workouts]":
            data.workouts,

        "[data-stat-calories]":
            data.calories,

        "[data-stat-minutes]":
            data.minutes,

        "[data-stat-streak]":
            data.streak
    };

    Object.entries(
        mappings
    ).forEach(
        ([selector, value]) => {
            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    element => {
                        element.textContent =
                            value;
                    }
                );
        }
    );
}


/* =========================================================
   RESET APP
   ========================================================= */

function resetAppData() {
    const keys = [
        "saiFitnessData",
        "saiProfileData",
        "saiWorkoutHistory",
        "saiDietData",
        "saiWater",
        "saiWaterHistory",
        "saiProgressData",
        "saiBodyData",
        "saiGoalTargets",
        "saiNotifications",
        "saiCompletedExercises",
        "saiSelectedExercise",
        "saiCustomTheme",
        "saiThemeEnabled"
    ];

    keys.forEach(
        removeStorage
    );

    showToast(
        "App data reset successfully"
    );

    setTimeout(() => {
        location.reload();
    }, 700);
}


/* =========================================================
   SANITIZE TEXT
   ========================================================= */

function escapeHTML(value) {
    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   GLOBAL API
   ========================================================= */

window.SaiFitness = {
    loadJSON,
    saveJSON,
    removeStorage,

    getAppSettings,
    saveAppSettings,

    getFitnessData,
    saveFitnessData,

    getAppContent,
    saveAppContent,

    getSavedTheme,
    applyGlobalTheme,

    getSEOSettings,
    applyGlobalSEO,

    applyGlobalContent,
    applyGlobalLogo,
    applyGlobalBanner,
    applyGlobalSettings,

    getTodayKey,
    getDateDifference,

    updateWorkoutStreak,
    completeWorkout,

    getWaterData,
    saveWaterData,
    addWater,

    getWorkoutHistory,
    clearWorkoutHistory,

    getCompletedExercises,
    markExerciseComplete,

    selectExercise,
    getSelectedExercise,

    getProfileData,
    saveProfileData,

    showToast,
    vibrate,
    playSound,

    safeNumber,
    updateDashboard,
    resetAppData,
    escapeHTML
};


/* =========================================================
   DOM READY
   ========================================================= */

function initSaiFitness() {
    try {
        applyGlobalSettings();
        updateDashboard();

        document.body?.classList.add(
            "sai-app-ready"
        );

    } catch (error) {
        console.error(
            "Sai Fitness initialization error:",
            error
        );
    }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initSaiFitness
    );
} else {
    initSaiFitness();
}


/* =========================================================
   VISIBILITY REFRESH
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {
        if (
            document.visibilityState ===
            "visible"
        ) {
            applyGlobalSettings();
            updateDashboard();
        }
    }
);


/* =========================================================
   STORAGE SYNC
   ========================================================= */

window.addEventListener(
    "storage",
    event => {
        if (
            [
                "saiAdminSEO",
                "saiAppContent",
                "saiCustomTheme",
                "saiMediaLogo",
                "saiMediaBanner",
                "saiFitnessData"
            ].includes(event.key)
        ) {
            applyGlobalSettings();
            updateDashboard();
        }
    }
);