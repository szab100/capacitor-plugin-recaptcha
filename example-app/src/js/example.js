import { RecaptchaEnterprise } from 'capacitor-plugin-recaptcha';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    RecaptchaEnterprise.echo({ value: inputValue })
}
