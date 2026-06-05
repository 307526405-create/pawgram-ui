import UIKit
import Capacitor
import WebKit

class PawgramViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Disable built-in gestures, use custom one
        webView?.allowsBackForwardNavigationGestures = false
        webView?.isOpaque = false
        webView?.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
        webView?.scrollView.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
        
        // Custom left-edge back gesture (disabled on Discover)
        let edgeSwipe = UIScreenEdgePanGestureRecognizer(target: self, action: #selector(handleSwipeBack(_:)))
        edgeSwipe.edges = .left
        webView?.addGestureRecognizer(edgeSwipe)
    }
    
    @objc func handleSwipeBack(_ gesture: UIScreenEdgePanGestureRecognizer) {
        if gesture.state == .recognized {
            let url = webView?.url?.absoluteString ?? ""
            if url.contains("discover") { return }
            webView?.goBack()
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
