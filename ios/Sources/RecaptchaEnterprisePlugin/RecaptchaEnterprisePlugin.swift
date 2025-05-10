import Foundation
import Capacitor
import RecaptchaEnterprise

@objc(RecaptchaEnterprisePlugin)
public class RecaptchaEnterprisePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "RecaptchaEnterprisePlugin"
    public let jsName = "RecaptchaEnterprise"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "load", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "execute", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = RecaptchaEnterprise()
    private var recaptchaClient: RecaptchaClient?
    private var siteKey: String?

    /**
     * Initializes the Recaptcha client with the given siteKey. Should be called during app startup.
     * @param call.siteKey The reCAPTCHA site key to use.
     */
    @objc func load(_ call: CAPPluginCall) {
        guard let key = call.getString("siteKey") else {
            call.reject("siteKey is required")
            return
        }
        self.siteKey = key
        print("RecaptchaEnterprisePlugin: Initializing Recaptcha client with siteKey: \(key)")
        Task {
            do {
                self.recaptchaClient = try await Recaptcha.fetchClient(withSiteKey: key)
                print("RecaptchaEnterprisePlugin: Recaptcha client initialized")
                call.resolve()
            } catch let error as RecaptchaError {
                print("RecaptchaEnterprisePlugin: RecaptchaClient creation error: \(String(describing: error.errorMessage)).")
                call.reject(error.errorMessage)
            } catch {
                print("RecaptchaEnterprisePlugin: RecaptchaClient creation unknown error: \(error)")
                call.reject("Unknown error: \(error)")
            }
        }
    }

    /**
     * Executes reCAPTCHA with the previously loaded siteKey. Throws an error if not loaded previously.
     * @param call.action The action to execute.
     */
    @objc func execute(_ call: CAPPluginCall) {
        let action = call.getString("action") ?? ""
        guard let client = self.recaptchaClient, let usedSiteKey = self.siteKey else {
            print("RecaptchaEnterprisePlugin: execute called before client initialized")
            call.reject("reCAPTCHA not loaded. Call load(siteKey) during app startup.")
            return
        }
        Task {
            do {
                let recaptchaAction = RecaptchaAction(customAction: action)
                let token = try await client.execute(withAction: recaptchaAction)
                let cleanToken = String(token).trimmingCharacters(in: .whitespacesAndNewlines)
                print("RecaptchaEnterprisePlugin: Returning token: [\(cleanToken)]")
                call.resolve(["token": cleanToken, "siteKey": usedSiteKey])
            } catch let error as RecaptchaError {
                call.reject(error.errorMessage)
            } catch {
                call.reject("Unknown error: \(error)")
            }
        }
    }
}
