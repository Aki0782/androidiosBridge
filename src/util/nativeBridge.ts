declare global {
  interface Window {
    AndroidInterface: {
      handlerToSendDataToAndroid: (jsonData: string) => void;
    };
    webkit: {
      messageHandlers: {
        sendToIOS: {
          postMessage: <T extends object>(jsonData: T) => void;
        };
      };
    };
  }
}

// Android Bridge

const handlerToSendDataToAndroid = <T extends object>(jsonData: T): void => {
  if (typeof window.AndroidInterface !== "undefined") {
    const jsonString = JSON.stringify(jsonData);
    window.AndroidInterface.handlerToSendDataToAndroid(jsonString);
  }
};

export const sendDataToAndroid = <T extends object>(jsonData: T): void => {
  handlerToSendDataToAndroid(jsonData);
};
// IOS Bridge

export const sendDataToIOS = <T extends object>(jsonData: T): void => {
  handlerToSendDataToIOS(jsonData);
};

const handlerToSendDataToIOS = <T extends object>(jsonData : T): void => {
  if (
    window.webkit !== undefined &&
    window.webkit.messageHandlers.sendToIOS !== undefined
  ) {
    window.webkit.messageHandlers.sendToIOS.postMessage(jsonData);
  } else {
    const err =
      window.webkit && window.webkit.messageHandlers.sendToIOS === undefined
        ? "Handler not found"
        : "IOS webkit not found";

    console.warn(err);
  }
};

// Receive data from Native

export const receiveJsonFromNative = <T extends object>(event: MessageEvent, setState: React.Dispatch<React.SetStateAction<T | null>>) => {
  const jsonData = event.data;
  setState(jsonData);
};

//TODO: Attach a custom Event handler after importing the handler. Pass the data via context to different parts of the app. 



// 	useEffect(() => {
//   const eventListener = (e: MessageEvent) => {
//     receiveJsonFromNative(e, setdata);
//   };

//   window.addEventListener("receiveMessageFromNative", eventListener as EventListener);

//   // Clean up the event listener on component unmount
//   return () => {
//     window.removeEventListener("receiveMessageFromNative", eventListener as EventListener);
//   };
// }, []);
