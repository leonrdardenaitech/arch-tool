<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Starting Server...</title>
    <style>
      :root {
        color-scheme: light dark;
      }

      body {
        font-family: Roboto, Helvetica, Arial, sans-serif;
        background-color: light-dark(#f5f5f5, #191919);
        color: light-dark(#0f0f10, #d4d4d4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        text-align: center;
      }

      .container {
        background: light-dark(#fff, #1f1f1f);
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow:
          0 4px 6px -1px light-dark(rgba(10, 13, 18, 0.1), rgba(0, 0, 0, 0.5)),
          0 2px 4px -2px light-dark(rgba(10, 13, 18, 0.06), rgba(0, 0, 0, 0.3));
        max-width: 450px;
        width: 100%;
      }

      h1 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: light-dark(#0f0f10, #d4d4d4);
      }

      p {
        font-size: 0.95rem;
        color: light-dark(#5b5b64, #8c8c8c);
        line-height: 1.5;
        margin: 0;
      }

      /* Loading Spinner Animation */
      .spinner {
        margin: 0 auto 1.5rem auto;
        width: 40px;
        height: 40px;
        border: 4px solid light-dark(#f0f0f0, #262626);
        border-top: 4px solid light-dark(#076eff, #87a9ff); /* Blue color */
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .logo {
        border-radius: 10px;
        display: block;
        margin: 0 auto 2rem auto;
      }

      .reload-button {
        margin-top: 2rem;
        padding: 10px 24px;
        font-family: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        border-radius: 100px;
        border: 1px solid light-dark(#ebebeb, #333);
        background-color: light-dark(#fff, #323232);
        color: light-dark(#0f0f10, #fcfcfc);
        transition: background-color 0.2s;
      }

      .reload-button:hover {
        background-color: light-dark(#ebebeb, #424242);
      }

      .reload-button:active {
        background-color: light-dark(#e5e5e5, #555);
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img
        class="logo"
        src="https://www.gstatic.com/aistudio/ai_studio_favicon_2_256x256.png"
        alt="AI Studio Logo"
        width="256"
        height="256"
      />
      <div class="spinner"></div>
      <h1>Please wait while your application starts...</h1>
      <p>
        If this page persists for a long time, there may have been an issue during the build
        process.
      </p>
      <button class="reload-button" onclick="window.location.reload()">Reload now</button>
    </div>

    <script>
      const MAX_RELOADS = 2;
      const RELOAD_DELAY_MS = 5000;
      const RESET_THRESHOLD_MS = 30000;

      const now = Date.now();
      let startTime = Number(sessionStorage.getItem("warmup_start_time") || "0");

      // If the last reload attempt was a long time ago, reset the start time.
      // This handles the case where the app was working but then restarted later.
      if (now - startTime > RESET_THRESHOLD_MS) {
        startTime = now;
        sessionStorage.setItem("warmup_start_time", startTime.toString());
      }

      // Reload if we are still within the allowed warmup window.
      if (now - startTime < MAX_RELOADS * RELOAD_DELAY_MS) {
        setTimeout(() => {
          window.location.reload();
        }, RELOAD_DELAY_MS);
      }
    </script>
  </body>
</html>
