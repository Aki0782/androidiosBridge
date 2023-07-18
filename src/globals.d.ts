interface Window {
AndroidInterface: {
sendDataToAndroid: (jsonData: string) => void;
};
webkit?: {
messageHandlers: {
sendToIOS: {
postMessage: (jsonData: { name: string }) => void;
};
};
};
handleReceivedJSON: (jsonData: string) => void;
}