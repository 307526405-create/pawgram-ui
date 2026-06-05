import UIKit
import Capacitor
import WebKit

class PawgramViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Disable built-in back/forward gestures
        webView?.allowsBackForwardNavigationGestures = false
        webView?.isOpaque = false
        webView?.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
        webView?.scrollView.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
        
        // Add custom left-edge swipe for back navigation only
        let edgeSwipe = UIScreenEdgePanGestureRecognizer(target: self, action: #selector(handleSwipeBack(_:)))
        edgeSwipe.edges = .left
        webView?.addGestureRecognizer(edgeSwipe)
    }
    
    @objc func handleSwipeBack(_ gesture: UIScreenEdgePanGestureRecognizer) {
        if gesture.state == .ended {
            let translation = gesture.translation(in: view)
            let velocity = gesture.velocity(in: view)
            if translation.x > 100 || velocity.x > 500 {
                webView?.goBack()
            }
        }
    }
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window?.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
