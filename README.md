<p align="center"><br><img src="https://user-images.githubusercontent.com/236501/85893648-1c92e880-b7a8-11ea-926d-95355b8175c7.png" width="128" height="128" /></p>
<h3 align="center">Capacitor Plugin reCAPTCHA Enterprise</h3>
<p align="center"><strong><code>capacitor-plugin-recaptcha</code></strong></p>
<p align="center">
  # Capacitor Plugin reCAPTCHA Enterprise

[![npm version](https://badge.fury.io/js/capacitor-plugin-recaptcha.svg)](https://badge.fury.io/js/capacitor-plugin-recaptcha)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/szab100/capacitor-plugin-recaptcha/actions/workflows/ci.yml/badge.svg)](https://github.com/szab100/capacitor-plugin-recaptcha/actions/workflows/ci.yml)

A cross-platform Capacitor plugin for integrating [Google reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs/overview) into your web, Android, and iOS apps.

---

## About This Plugin

**Capacitor Plugin reCAPTCHA Enterprise** enables you to easily integrate [Google reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs/overview) in your Capacitor-based apps. It provides a simple, unified API for Web, Android, and iOS platforms.

- **Android & iOS**: This plugin is based on the official [Google reCAPTCHA Enterprise Mobile SDK setup guide](https://cloud.google.com/recaptcha/docs/setup-overview-mobile). It uses the native SDKs for maximum security and compatibility.
- **Web**: Uses the [recaptcha-v3](https://www.npmjs.com/package/recaptcha-v3) package under the hood for seamless browser integration.

### Why use this plugin?
- Unified API for all platforms
- Secure, production-ready integration
- Designed for backend token assessment

---

## Prerequisites & Platform-specific Notes

### Android
- Your app's package name **must be whitelisted** in your reCAPTCHA site key settings in Google Cloud Console.
- Follow the [Android setup instructions](https://cloud.google.com/recaptcha/docs/setup-android).

### iOS
- Your app's bundle identifier **must be whitelisted** in your reCAPTCHA site key settings.
- You **must** follow the [iOS setup instructions](https://cloud.google.com/recaptcha/docs/setup-ios) in detail:
  - Add the **App Attest** capability to your app.
  - Configure the required entitlements and provisioning profiles.
  - Ensure your app is signed with the correct Apple Developer Team.
  - See the [official iOS documentation](https://cloud.google.com/recaptcha/docs/setup-ios) for all required steps.

### Web
- No extra setup needed beyond providing your reCAPTCHA Enterprise site key.
- See [recaptcha-v3 npm package](https://www.npmjs.com/package/recaptcha-v3) for more details.

---
</p>

## Backend Token Verification Example

After you obtain a token from the plugin, you must verify and assess it on your backend using the Google reCAPTCHA Enterprise API.

See the official Google documentation: [Create an assessment (Node.js)](https://cloud.google.com/recaptcha/docs/create-assessment-website#create-assessment-Node.js)

### TypeScript/Node.js Example for Verifying a reCAPTCHA Enterprise Token

First, install the required package:

```bash
npm install @google-cloud/recaptcha-enterprise
```

Here's a TypeScript/Node.js example for verifying a reCAPTCHA Enterprise token:
```typescript
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

static verifyRecaptchaEnterprise = async (token: string, siteKey: string, expectedAction = 'LOGIN'): Promise<boolean> => {
  try {
    const projectId = firebaseServiceAccount.project_id;
    if (!projectId || !siteKey) {
      throw new Error('Google Cloud project ID not set or site key is missing.');
    }

    const client = new RecaptchaEnterpriseServiceClient({
      credentials: {
        // Use your credentials or set the GOOGLE_APPLICATION_CREDENTIALS environment variable
        client_email: firebaseServiceAccount.client_email,
        private_key: firebaseServiceAccount.private_key,
      },
      projectId: firebaseServiceAccount.project_id,
    });

    const [assessment] = await client.createAssessment({
      parent: `projects/${projectId}`,
      assessment: {
        event: {
          token,
          siteKey,
        },
      },
    });

    // Check for valid token and action match
    const { tokenProperties, riskAnalysis } = assessment;
    if (!tokenProperties || !tokenProperties.valid) {
      console.error('Invalid or missing reCAPTCHA token properties:', tokenProperties?.invalidReason);
      return false;
    }
    if (tokenProperties.action !== expectedAction.toLowerCase()) {
      console.error('reCAPTCHA action mismatch:', tokenProperties.action);
      return false;
    }

    // You can adjust the threshold as needed (0.5 is a common default)
    const score = riskAnalysis?.score ?? 0;
    return score >= 0.5;
  } catch (error) {
    console.error('Error verifying reCAPTCHA Enterprise:', error);
    return false;
  }
};
```

**Key points:**
- Always verify the token and action server-side.
- Assess the risk score and handle accordingly.
- Never trust the token or score on the client.
- You must use your Google Cloud project credentials.

---

## Maintainers

| Maintainer | GitHub | Social |
| -----------| -------| -------|
| Szabolcs Fruhwald (szab100) | [szab100](https://github.com/szab100) | [@szab100](https://x.com/szab100) |

## Installation

```bash
npm install capacitor-plugin-recaptcha
npx cap sync
```

## API

* [`load(...)`](#load)
* [`execute(...)`](#execute)

## Usage
<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### load(...)

```typescript
load(options: { siteKey: string; }) => Promise<void>
```

Loads the reCAPTCHA SDK or native client with the given siteKey. Must be called during app startup before any execute calls.

| Param         | Type                              |
| ------------- | --------------------------------- |
| **`options`** | <code>{ siteKey: string; }</code> |

--------------------


### execute(...)

```typescript
execute(options: { action: string; }) => Promise<{ token: string; siteKey: string; }>
```

Executes reCAPTCHA Enterprise with the given action and returns a token.

| Param         | Type                             |
| ------------- | -------------------------------- |
| **`options`** | <code>{ action: string; }</code> |

**Returns:** <code>Promise&lt;{ token: string; siteKey: string; }&gt;</code>

--------------------

</docgen-api>