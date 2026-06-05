import UIKit
import Capacitor
import WebKit

class PawgramViewController: CAPBridgeViewController, UIGestureRecognizerDelegate {
    override func viewDidLoad() {
        super.viewDidLoad()
        webView?.allowsBackForwardNavigationGestures = true
        webView?.isOpaque = false
        webView?.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
        webView?.scrollView.backgroundColor = UIColor(red: 1.0, green: 0.549, blue: 0.259, alpha: 1.0)
        
        DispatchQueue.main.async { [weak self] in
            guard let self, let wv = self.webView else { return }
            self.configureGestures(in: wv)
        }
    }
    
    func configureGestures(in view: UIView) {
        for gr in view.gestureRecognizers ?? [] {
            if let edge = gr as? UIScreenEdgePanGestureRecognizer {
                if edge.edges == .right || edge.edges.contains(.right) {
                    edge.isEnabled = false // disable forward
                } else {
                    edge.delegate = self // intercept back on Discover
                }
            }
        }
        for sv in view.subviews {
            configureGestures(in: sv)
        }
    }
    
    func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        let url = webView?.url?.absoluteString ?? ""
        // Only disable on PostCreate (exact /post, not /post/:id)
        if url.hasSuffix("/post") || url.contains("/post?") { return false }
        return true
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
