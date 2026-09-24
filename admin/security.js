/*
=========================================================
SAI FITNESS BIDUPUR
ADMIN SECURITY ENGINE
=========================================================

File:
GYM-PRO/admin/admin-security.js

NOTE:
This is a LOCAL / Acode browser security layer.

For real production security use:
PHP + MySQL + server-side sessions + HTTPS.

Demo account:
Username: admin
Password: sai@1234
PIN: 1234
=========================================================
*/

(function () {

  "use strict";


  /* =====================================================
     STORAGE KEYS
  ===================================================== */

  const KEYS = {

    USERS: "saiAdminUsers",

    SESSION: "saiAdminSession",

    SETTINGS: "saiAdminSettings",

    LOGS: "saiAdminLogs",

    PERMISSIONS: "saiAdminRolePermissions"

  };


  /* =====================================================
     DEFAULT SECURITY
  ===================================================== */

  const DEFAULT_SECURITY = {

    authEnabled: true,

    sessionEnabled: true,

    loggingEnabled: true,

    pinEnabled: true,

    sessionTimeout: 30,

    adminPin: "1234"

  };


  /* =====================================================
     PERMISSIONS
  ===================================================== */

  const ALL_PERMISSIONS = [

    "dashboard",

    "members",

    "workouts",

    "exercises",

    "diet",

    "goals",

    "achievements",

    "notifications",

    "theme",

    "css-manager",

    "animation-manager",

    "media",

    "page-builder",

    "content",

    "seo",

    "analytics",

    "backup",

    "pwa",

    "version",

    "maintenance",

    "security",

    "settings"

  ];


  const DEFAULT_ROLE_PERMISSIONS = {

    owner: [...ALL_PERMISSIONS],

    manager: [

      "dashboard",
      "members",
      "workouts",
      "exercises",
      "diet",
      "goals",
      "achievements",
      "notifications",
      "media",
      "content",
      "analytics",
      "backup",
      "settings"

    ],

    trainer: [

      "dashboard",
      "members",
      "workouts",
      "exercises",
      "diet",
      "goals",
      "achievements",
      "notifications"

    ],

    staff: [

      "dashboard",
      "members",
      "workouts"

    ]

  };


  /* =====================================================
     STORAGE HELPERS
  ===================================================== */

  function readJSON(key, fallback) {

    try {

      const value =
        localStorage.getItem(key);

      if (!value) {

        return fallback;

      }

      return JSON.parse(value);

    } catch (error) {

      console.warn(
        "Security storage read error:",
        key,
        error
      );

      return fallback;

    }

  }


  function writeJSON(key, value) {

    try {

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;

    } catch (error) {

      console.error(
        "Security storage write error:",
        key,
        error
      );

      return false;

    }

  }


  /* =====================================================
     SETTINGS
  ===================================================== */

  function getSettings() {

    const saved =
      readJSON(
        KEYS.SETTINGS,
        {}
      );

    return {

      ...DEFAULT_SECURITY,

      ...saved

    };

  }


  function saveSettings(settings) {

    return writeJSON(
      KEYS.SETTINGS,
      settings
    );

  }


  /* =====================================================
     DEFAULT USER
  ===================================================== */

  function ensureDefaultUser() {

    let users =
      readJSON(
        KEYS.USERS,
        []
      );


    if (
      !Array.isArray(users)
    ) {

      users = [];

    }


    if (users.length === 0) {

      users.push({

        id:
          "admin_" +
          Date.now(),

        username:
          "admin",

        name:
          "Administrator",

        password:
          "sai@1234",

        role:
          "owner",

        active:
          true,

        createdAt:
          new Date().toISOString(),

        lastLogin:
          null

      });


      writeJSON(
        KEYS.USERS,
        users
      );

    }


    return users;

  }


  /* =====================================================
     SESSION
  ===================================================== */

  function getSession() {

    return readJSON(
      KEYS.SESSION,
      null
    );

  }


  function saveSession(session) {

    return writeJSON(
      KEYS.SESSION,
      session
    );

  }


  function clearSession() {

    try {

      localStorage.removeItem(
        KEYS.SESSION
      );

    } catch (error) {

      console.warn(error);

    }

  }


  /* =====================================================
     CURRENT USER
  ===================================================== */

  function getCurrentUser() {

    const session =
      getSession();


    if (!session) {

      return null;

    }


    const users =
      ensureDefaultUser();


    return (
      users.find(
        user =>
          user.id ===
          session.userId
      ) || null
    );

  }


  /* =====================================================
     SESSION VALIDATION
  ===================================================== */

  function isSessionValid() {

    const settings =
      getSettings();

    const session =
      getSession();


    if (!session) {

      return false;

    }


    if (!session.userId) {

      return false;

    }


    const users =
      ensureDefaultUser();


    const user =
      users.find(
        item =>
          item.id ===
          session.userId
      );


    if (
      !user ||
      user.active === false
    ) {

      clearSession();

      return false;

    }


    if (
      settings.sessionEnabled === false
    ) {

      return true;

    }


    const timeout =
      Number(
        settings.sessionTimeout
      );


    if (
      !timeout ||
      timeout <= 0
    ) {

      return true;

    }


    const lastActivity =
      Number(
        session.lastActivity ||
        session.loginAt ||
        0
      );


    const elapsed =
      Date.now() -
      lastActivity;


    const limit =
      timeout *
      60 *
      1000;


    if (
      elapsed > limit
    ) {

      addLog(
        "Session expired",
        user.username
      );

      clearSession();

      return false;

    }


    return true;

  }


  /* =====================================================
     UPDATE ACTIVITY
  ===================================================== */

  function updateActivity() {

    const session =
      getSession();


    if (!session) {

      return;

    }


    session.lastActivity =
      Date.now();


    saveSession(
      session
    );

  }


  /* =====================================================
     AUTH CHECK
  ===================================================== */

  function isAuthenticated() {

    const settings =
      getSettings();


    if (
      settings.authEnabled === false
    ) {

      return true;

    }


    return isSessionValid();

  }


  /* =====================================================
     REQUIRE AUTH
  ===================================================== */

  function requireAuth(permission) {

    ensureDefaultUser();


    const settings =
      getSettings();


    if (
      settings.authEnabled === false
    ) {

      return true;

    }


    if (
      !isAuthenticated()
    ) {

      redirectToLogin();

      return false;

    }


    const user =
      getCurrentUser();


    if (!user) {

      redirectToLogin();

      return false;

    }


    if (
      permission &&
      !hasPermission(
        user.role,
        permission
      )
    ) {

      showAccessDenied();

      return false;

    }


    updateActivity();


    return true;

  }


  /* =====================================================
     REDIRECT
  ===================================================== */

  function redirectToLogin() {

    const current =
      location.pathname
        .split("/")
        .pop();


    if (
      current === "login.html"
    ) {

      return;

    }


    location.href =
      "login.html?redirect=" +
      encodeURIComponent(
        current || "index.html"
      );

  }


  /* =====================================================
     ACCESS DENIED
  ===================================================== */

  function showAccessDenied() {

    document.body.innerHTML = `

      <div style="
        min-height:100vh;
        background:#070b09;
        color:#f5f7f6;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:25px;
        font-family:Inter,Arial,sans-serif;
        text-align:center;
      ">

        <div style="
          width:min(430px,100%);
          padding:30px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:22px;
          background:#101914;
        ">

          <div style="
            width:65px;
            height:65px;
            margin:0 auto 18px;
            border-radius:20px;
            display:grid;
            place-items:center;
            background:rgba(239,68,68,.1);
            color:#f87171;
            font-size:27px;
          ">

            <i class="fa-solid fa-lock"></i>

          </div>

          <h2 style="
            font-size:20px;
            margin-bottom:8px;
          ">
            Access Denied
          </h2>

          <p style="
            color:#91a099;
            font-size:12px;
            line-height:1.7;
          ">
            Your administrator role does not have
            permission to access this section.
          </p>

          <button
            onclick="history.back()"
            style="
              margin-top:20px;
              border:0;
              border-radius:11px;
              padding:11px 16px;
              background:#16a34a;
              color:#fff;
              font-weight:700;
            "
          >
            Go Back
          </button>

        </div>

      </div>

    `;

  }


  /* =====================================================
     ROLE PERMISSIONS
  ===================================================== */

  function getRolePermissions() {

    const saved =
      readJSON(
        KEYS.PERMISSIONS,
        {}
      );


    const result = {};


    Object.keys(
      DEFAULT_ROLE_PERMISSIONS
    ).forEach(role => {

      result[role] =
        Array.isArray(saved[role])
          ? saved[role]
          : [
              ...DEFAULT_ROLE_PERMISSIONS[role]
            ];

    });


    return result;

  }


  function hasPermission(
    role,
    permission
  ) {

    if (!permission) {

      return true;

    }


    if (
      role === "owner"
    ) {

      return true;

    }


    const permissions =
      getRolePermissions();


    const list =
      permissions[role] || [];


    return list.includes(
      permission
    );

  }


  /* =====================================================
     ROLE NAME
  ===================================================== */

  function getRoleName(role) {

    const names = {

      owner:
        "Owner",

      manager:
        "Manager",

      trainer:
        "Trainer",

      staff:
        "Staff"

    };


    return (
      names[role] ||
      "Administrator"
    );

  }


  /* =====================================================
     LOGIN
  ===================================================== */

  function login(
    username,
    password
  ) {

    username =
      String(
        username || ""
      ).trim();


    password =
      String(
        password || ""
      );


    if (
      !username ||
      !password
    ) {

      return {

        success:false,

        message:
          "Username and password are required."

      };

    }


    const users =
      ensureDefaultUser();


    const user =
      users.find(
        item =>
          item.username
            .toLowerCase() ===
          username.toLowerCase()
      );


    if (!user) {

      addLog(
        "Login failed",
        username
      );


      return {

        success:false,

        message:
          "Invalid username or password."

      };

    }


    if (
      user.active === false
    ) {

      addLog(
        "Login blocked",
        username +
        " is disabled"
      );


      return {

        success:false,

        message:
          "This administrator account is disabled."

      };

    }


    if (
      user.password !==
      password
    ) {

      addLog(
        "Login failed",
        username
      );


      return {

        success:false,

        message:
          "Invalid username or password."

      };

    }


    const now =
      Date.now();


    const session = {

      userId:
        user.id,

      username:
        user.username,

      role:
        user.role,

      loginAt:
        now,

      lastActivity:
        now,

      token:
        createToken()

    };


    saveSession(
      session
    );


    user.lastLogin =
      new Date()
        .toISOString();


    writeJSON(
      KEYS.USERS,
      users
    );


    addLog(
      "Admin login",
      user.username
    );


    return {

      success:true,

      user,

      session

    };

  }


  /* =====================================================
     PIN LOGIN
  ===================================================== */

  function loginWithPIN(pin) {

    const settings =
      getSettings();


    if (
      settings.pinEnabled === false
    ) {

      return {

        success:false,

        message:
          "PIN login is disabled."

      };

    }


    pin =
      String(
        pin || ""
      );


    if (
      pin !==
      String(
        settings.adminPin
      )
    ) {

      addLog(
        "PIN login failed",
        "Invalid PIN"
      );


      return {

        success:false,

        message:
          "Invalid PIN."

      };

    }


    const users =
      ensureDefaultUser();


    const owner =
      users.find(
        user =>
          user.role ===
          "owner" &&
          user.active !== false
      );


    if (!owner) {

      return {

        success:false,

        message:
          "No active Owner account found."

      };

    }


    const now =
      Date.now();


    const session = {

      userId:
        owner.id,

      username:
        owner.username,

      role:
        owner.role,

      loginAt:
        now,

      lastActivity:
        now,

      pinLogin:
        true,

      token:
        createToken()

    };


    saveSession(
      session
    );


    owner.lastLogin =
      new Date()
        .toISOString();


    writeJSON(
      KEYS.USERS,
      users
    );


    addLog(
      "PIN login",
      owner.username
    );


    return {

      success:true,

      user:owner,

      session

    };

  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {

    const user =
      getCurrentUser();


    if (user) {

      addLog(
        "Admin logout",
        user.username
      );

    }


    clearSession();

  }


  /* =====================================================
     CHANGE PASSWORD
  ===================================================== */

  function changePassword(
    userId,
    currentPassword,
    newPassword
  ) {

    const users =
      ensureDefaultUser();


    const user =
      users.find(
        item =>
          item.id ===
          userId
      );


    if (!user) {

      return {

        success:false,

        message:
          "Administrator not found."

      };

    }


    if (
      user.password !==
      currentPassword
    ) {

      return {

        success:false,

        message:
          "Current password is incorrect."

      };

    }


    if (
      String(
        newPassword || ""
      ).length < 6
    ) {

      return {

        success:false,

        message:
          "Password must contain at least 6 characters."

      };

    }


    user.password =
      newPassword;


    writeJSON(
      KEYS.USERS,
      users
    );


    addLog(
      "Password changed",
      user.username
    );


    return {

      success:true,

      message:
        "Password changed successfully."

    };

  }


  /* =====================================================
     LOGGING
  ===================================================== */

  function addLog(
    action,
    detail
  ) {

    const settings =
      getSettings();


    if (
      settings.loggingEnabled === false
    ) {

      return;

    }


    const logs =
      readJSON(
        KEYS.LOGS,
        []
      );


    const list =
      Array.isArray(logs)
        ? logs
        : [];


    list.unshift({

      id:
        Date.now(),

      action:
        String(
          action || ""
        ),

      detail:
        String(
          detail || ""
        ),

      time:
        new Date()
          .toISOString()

    });


    writeJSON(
      KEYS.LOGS,
      list.slice(0,100)
    );

  }


  function getLogs() {

    const logs =
      readJSON(
        KEYS.LOGS,
        []
      );


    return Array.isArray(logs)
      ? logs
      : [];

  }


  /* =====================================================
     TOKEN
  ===================================================== */

  function createToken() {

    const random =
      Math.random()
        .toString(36)
        .slice(2);


    return (
      Date.now()
      .toString(36) +
      "_" +
      random
    );

  }


  /* =====================================================
     AUTO SESSION ACTIVITY
  ===================================================== */

  function setupActivityTracking() {

    let timer = null;


    const activity =
      () => {

        clearTimeout(
          timer
        );


        timer =
          setTimeout(
            () => {

              if (
                isAuthenticated()
              ) {

                updateActivity();

              }

            },
            500
          );

      };


    [
      "click",
      "touchstart",
      "keydown",
      "mousemove",
      "scroll"
    ].forEach(
      event => {

        document.addEventListener(
          event,
          activity,
          {
            passive:true
          }
        );

      }
    );

  }


  /* =====================================================
     SESSION CHECK LOOP
  ===================================================== */

  function startSessionWatcher() {

    setInterval(
      () => {

        const settings =
          getSettings();


        if (
          settings.authEnabled === false
        ) {

          return;

        }


        if (
          !getSession()
        ) {

          return;

        }


        if (
          !isSessionValid()
        ) {

          const page =
            location.pathname
              .split("/")
              .pop();


          if (
            page !==
            "login.html"
          ) {

            redirectToLogin();

          }

        }

      },
      30000
    );

  }


  /* =====================================================
     GLOBAL SECURITY OBJECT
  ===================================================== */

  window.Security = {

    KEYS,

    ALL_PERMISSIONS,

    getSettings,

    saveSettings,

    getSession,

    getCurrentUser,

    isAuthenticated,

    isSessionValid,

    requireAuth,

    hasPermission,

    getRoleName,

    getRolePermissions,

    login,

    loginWithPIN,

    logout,

    changePassword,

    addLog,

    getLogs,

    updateActivity,

    clearSession,

    ensureDefaultUser

  };


  /* =====================================================
     START ENGINE
  ===================================================== */

  ensureDefaultUser();

  setupActivityTracking();

  startSessionWatcher();


  /* =====================================================
     STORAGE SYNC
  ===================================================== */

  window.addEventListener(
    "storage",
    event => {

      if (
        event.key ===
        KEYS.SESSION
      ) {

        const page =
          location.pathname
            .split("/")
            .pop();


        if (
          !event.newValue &&
          page !==
          "login.html"
        ) {

          redirectToLogin();

        }

      }

    }
  );


})();