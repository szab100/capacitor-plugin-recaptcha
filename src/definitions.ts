export interface RecaptchaEnterprisePlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
