import React, { useEffect, useCallback } from "react";
import { authApi } from "@/services/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            config: { theme: string; size: string; width: string }
          ) => void;
        };
      };
    };
  }
}

const CLIENT_ID =
  "435076307853-sp06greujg8shmrtip21kqkmc2gjfm1h.apps.googleusercontent.com";

const GoogleLoginButton: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const handleCallback = useCallback(
    async (response: { credential: string }) => {
      try {
        const { accessToken } = await authApi.googleLogin(response.credential);
        localStorage.setItem("fuskit_token", accessToken);
        localStorage.setItem("fuskit_auth", "true");
        onLogin();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Google login failed.";
        alert(msg);
      }
    },
    [onLogin]
  );

  useEffect(() => {
    // The GSI script loads asynchronously, so poll until window.google is ready
    let attempts = 0;
    const maxAttempts = 20; // wait up to ~2 seconds

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCallback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleButton"),
          { theme: "outline", size: "large", width: "100%" }
        );
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(initGoogle, 100);
      }
    };

    initGoogle();
  }, [handleCallback]);

  return (
    <div className="w-full">
      <div id="googleButton" className="flex w-full justify-center" />
    </div>
  );
};

export default GoogleLoginButton;
