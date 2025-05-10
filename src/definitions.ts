export interface RecaptchaEnterprisePlugin {
  /**
   * Loads the reCAPTCHA SDK or native client with the given siteKey. Must be called during app startup before any execute calls.
   * @param options.siteKey The site key to use for initialization
   */
  load(options: { siteKey: string }): Promise<void>;
  /**
   * Executes reCAPTCHA Enterprise with the given action and returns a token.
   * @param options.action The action name for reCAPTCHA (e.g. 'login')
   * @returns {Promise<{ token: string }>} The resulting reCAPTCHA token
   */
  execute(options: { action: string }): Promise<{ token: string; siteKey: string }>;
}
