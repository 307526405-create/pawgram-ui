import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Prevent white flash between LaunchScreen and React render
        DispatchQueue.main.async {
            if let vc = self.window?.rootViewController as? CAPBridgeViewController {
                vc.webView?.isOpaque = false
                vc.webView?.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
                vc.webView?.scrollView.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
            }
        }
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
