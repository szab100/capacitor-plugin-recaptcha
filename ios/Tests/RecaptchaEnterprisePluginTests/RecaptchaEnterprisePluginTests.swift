import XCTest
@testable import RecaptchaEnterprisePlugin

class RecaptchaEnterpriseTests: XCTestCase {
    func testLoadAndExecute() {
        let plugin = RecaptchaEnterprisePlugin()
        let expectation = self.expectation(description: "Load and execute reCAPTCHA")

        plugin.load(CAPPluginCall(callbackId: "test", options: ["siteKey": "test_site_key"]))

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            plugin.execute(CAPPluginCall(callbackId: "test", options: ["action": "test_action"]))
        }

        waitForExpectations(timeout: 5, handler: nil)

        XCTAssertNotNil(plugin.recaptchaClient)
        XCTAssertEqual(plugin.siteKey, "test_site_key")
    }
}
