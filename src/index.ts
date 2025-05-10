import { registerPlugin } from '@capacitor/core';

import type { RecaptchaEnterprisePlugin } from './definitions';

const CapacitorPluginRecaptcha = registerPlugin<RecaptchaEnterprisePlugin>('RecaptchaEnterprise', {
  web: () => import('./web').then((m) => new m.CapacitorPluginRecaptcha()),
});

export * from './definitions';
export { CapacitorPluginRecaptcha };
