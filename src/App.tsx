import React, { useEffect, useState } from "react";
import { receiveJsonFromNative, sendDataToAndroid, sendDataToIOS } from "./util/nativeBridge";

const App: React.FC = () => {
	const [data, setdata] = useState<object | null>(null);

	useEffect(() => {
  const eventListener = (e: MessageEvent) => {
    receiveJsonFromNative(e, setdata);
  };

  window.addEventListener("receiveMessageFromNative", eventListener as EventListener);

  // Clean up the event listener on component unmount
  return () => {
    window.removeEventListener("receiveMessageFromNative", eventListener as EventListener);
  };
}, []);
	return (
		<div>
			<button onClick={() => sendDataToAndroid({name: "Hello from React"})}>
				send data to Android
			</button>
			<button onClick={() => sendDataToIOS({name: "Hello from React"})}>send data to IOS</button>

			<h1>Receive Data: {JSON.stringify(data)}</h1>
		</div>
	);
};

export default App;

// Triggering receiveJsonFromAndroid  for testing from browser side.

// const testData = {
//     key1: 'value1',
//     key2: 'value2',
//   };

//   const messageEvent = new MessageEvent('receiveMessageFromNative', {
//     data: JSON.stringify(testData),
//   });
//   window.dispatchEvent(messageEvent);

// Kotlin Native side to trigger receiveJsonFromAndroid

// class AndroidInterface {

//     @JavascriptInterface
//     fun receiveJsonFromAndroid(jsonData: String) {
//         // Log the received data
//         Log.d("Received JSON", jsonData)

//         // Pass the JSON data back to the WebView
//         webView.post { webView.evaluateJavascript("window.dispatchEvent(new MessageEvent('receiveMessageFromNative', { data: $jsonData }));", null) }
//     }
// }

// Kotlin Native to receive data from React

// class AndroidInterface {

//     @JavascriptInterface
//     fun receiveJsonFromWebView(jsonData: String) {
//         // Convert the JSON string back to an object
//         val data = JSONObject(jsonData)

//         // Log the received data
//         Log.d("Received JSON", data.toString())

//         // Handle the received JSON data in Kotlin
//         handleReceivedJsonFromWebView(data)
//     }

//     private fun handleReceivedJsonFromWebView(data: JSONObject) {
//         // Extract the values from the JSON object
//         val value1 = data.getString("key1")
//         val value2 = data.getString("key2")

//         // Process the values as desired
//         // ...
//     }
// }

// IOS Native side to trigger receiveJsonFromAndroid

// import WebKit

// class ViewController: UIViewController, WKNavigationDelegate {
//     // ...

//     // Function to send JSON data to the React TypeScript app
//     func sendJsonToReact(data: [String: Any]) {
//         do {
//             let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
//             let jsonString = String(data: jsonData, encoding: .utf8)!

//             let javascriptCode = "window.dispatchEvent(new MessageEvent('receiveMessageFromNative', { data: '\(jsonString)' }));"
//             webView.evaluateJavaScript(javascriptCode, completionHandler: nil)
//         } catch {
//             print("Error converting data to JSON: \(error)")
//         }
//     }

//     // Call the function to send JSON data to the React TypeScript app
//     func sendDataToReact() {
//         let json: [String: Any] = [
//             "key1": "value1",
//             "key2": "value2"
//         ]

//         sendJsonToReact(data: json)
//     }

//     override func viewDidLoad() {
//         super.viewDidLoad()

//         // ...

//         sendDataToReact()
//     }
// }

// IOS Native to receive data from React

// import WebKit

// class ViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {
//     private var webView: WKWebView!

//     override func viewDidLoad() {
//         super.viewDidLoad()

//         webView = WKWebView(frame: view.bounds)
//         webView.navigationDelegate = self
//         view.addSubview(webView)

//         let url = Bundle.main.url(forResource: "your_react_app", withExtension: "html")
//         let request = URLRequest(url: url!)
//         webView.load(request)

//         // Add user script message handler
//         webView.configuration.userContentController.add(self, name: "message")
//     }

//     // Handle the received JSON data in Swift
//     private func handleReceivedJsonFromWebView(data: [String: Any]) {
//         // Extract the values from the JSON dictionary
//         if let value1 = data["key1"] as? String,
//            let value2 = data["key2"] as? String {
//             // Process the values as desired
//             // ...

//             print("Received JSON - Value 1: \(value1), Value 2: \(value2)")
//         }
//     }

//     // Implement WKScriptMessageHandler method to receive messages from JavaScript
//     func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
//         if message.name == "message",
//            let jsonData = message.body as? String,
//            let data = try? JSONSerialization.jsonObject(with: jsonData.data(using: .utf8)!, options: []) as? [String: Any] {
//             // Log the received JSON data
//             print("Received JSON:", data)

//             // Handle the received JSON data in Swift
//             handleReceivedJsonFromWebView(data: data)
//         }
//     }
// }
