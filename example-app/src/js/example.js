import { Capacitor } from '@capacitor/core';
import { CapacitorPluginRecaptcha } from 'capacitor-plugin-recaptcha';

function loadRecaptcha() {
    console.log('Loading reCAPTCHA...');
    const siteKey = (() => {
        switch (Capacitor.getPlatform()) {
            case 'web':
                return 'your-web-site-key';
            case 'ios':
                return 'your-ios-site-key';
            case 'android':
                return 'your-android-site-key';
        }
    })();
    CapacitorPluginRecaptcha.load({ siteKey });
}

// Load reCAPTCHA during app startup
loadRecaptcha();

// Run reCAPTCHA and display token
window.runRecaptcha = async () => {
    const action = document.getElementById('recaptchaAction').value;
    const resultDiv = document.getElementById('recaptchaResult');
    resultDiv.textContent = 'Running reCAPTCHA...';
    try {
        const result = await CapacitorPluginRecaptcha.execute({ action });
        resultDiv.textContent = 'Token: ' + result.token;
    } catch (err) {
        resultDiv.textContent = 'Error: ' + (err && err.message ? err.message : JSON.stringify(err));
    }
}

// Run reCAPTCHA and post to backend
window.postWithRecaptcha = async () => {
    const action = document.getElementById('recaptchaAction').value;
    const url = document.getElementById('recaptchaBackendUrl').value;
    const resultDiv = document.getElementById('recaptchaPostResult');
    resultDiv.textContent = 'Running reCAPTCHA and sending to your backend...';
    try {
        const recaptchaResult = await CapacitorPluginRecaptcha.execute({ action });
        const token = recaptchaResult.token;
        const siteKey = recaptchaResult.siteKey;
        const payload = {
            recaptchaSiteKey: siteKey,
            recaptchaToken: token,
            // add any other fields your backend needs
            otherField: 'your-value'
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const responseBody = await response.text();
        resultDiv.textContent = `Status: ${response.status}\nBody: ${responseBody}`;
    } catch (err) {
        resultDiv.textContent = 'Error: ' + (err && err.message ? err.message : JSON.stringify(err));
    }
}

