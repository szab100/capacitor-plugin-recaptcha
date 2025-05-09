import { WebPlugin } from '@capacitor/core';

import type { RecaptchaEnterprisePlugin } from './definitions';

export class RecaptchaEnterpriseWeb extends WebPlugin implements RecaptchaEnterprisePlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
