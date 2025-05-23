// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorPluginRecaptcha",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapacitorPluginRecaptcha",
            targets: ["RecaptchaEnterprisePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.2.0")
    ],
    targets: [
        .target(
            name: "RecaptchaEnterprisePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/RecaptchaEnterprisePlugin"),
        .testTarget(
            name: "RecaptchaEnterprisePluginTests",
            dependencies: ["RecaptchaEnterprisePlugin"],
            path: "ios/Tests/RecaptchaEnterprisePluginTests")
    ]
)
