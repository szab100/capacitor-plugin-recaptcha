import { registerPlugin } from '@capacitor/core';

import type { RecaptchaEnterprisePlugin } from './definitions';

const RecaptchaEnterprise = registerPlugin<RecaptchaEnterprisePlugin>('RecaptchaEnterprise', {
  web: () => import('./web').then((m) => new m.RecaptchaEnterpriseWeb()),
});

export * from './definitions';
export { RecaptchaEnterprise };
