import { WebPlugin } from '@capacitor/core';
import { load } from 'recaptcha-v3';

import type { RecaptchaEnterprisePlugin } from './definitions';

declare global {
  interface Window {
    Capacitor?: any;
  }
}

export interface WebExecuteOptions {
  // no change needed here
  action: string;
  useEnterprise?: boolean;
  autoHideBadge?: boolean;
  useRecaptchaNet?: boolean;
  [key: string]: any;
}

export class CapacitorPluginRecaptcha extends WebPlugin implements RecaptchaEnterprisePlugin {
  /**
   * Loads the reCAPTCHA SDK for the given siteKey. Should be called during app startup.
   * @param siteKey The reCAPTCHA site key to use.
   */
  async load(options: { siteKey: string }): Promise<void> {
    this._recaptcha = await load(options.siteKey, { useEnterprise: true });
    this._siteKey = options.siteKey;
  }

  /**
   * Executes reCAPTCHA with the previously loaded siteKey. Throws if not loaded.
   */
  async execute(options: WebExecuteOptions): Promise<{ token: string; siteKey: string }> {
    if (!this._recaptcha || !this._siteKey) {
      throw new Error('reCAPTCHA not loaded. Call load(siteKey) during app startup.');
    }
    try {
      const token = await this._recaptcha.execute(options.action);
      return { token, siteKey: this._siteKey };
    } catch (err: any) {
      throw new Error(`reCAPTCHA execution failed: ${err?.message || JSON.stringify(err)}`);
    }
  }

  private _recaptcha: any;
  private _siteKey: string | undefined;
}
