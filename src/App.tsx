import { useEffect, useState } from "react";

interface CustomEvent<T> {
  detail: T | string;
}

const App: React.FC = () => {
  const [data, setData] = useState("");

  const handleReceiveDataFromAndroid = (event: MessageEvent): void => {
  const customEvent: CustomEvent<{ data: string }> = new CustomEvent("message", {
    detail: event.data,
  });

  const jsonData = customEvent.detail;
  console.log(jsonData);

  if (jsonData !== null && typeof jsonData === 'object' && !Array.isArray(jsonData) && jsonData.data !== undefined) {
    setData(jsonData.data);
  }
};

  const sendDataToAndroid = (jsonData: { name: string; }): void => {
    if (typeof window.AndroidInterface !== "undefined") {
      window.AndroidInterface.sendDataToAndroid(JSON.stringify(jsonData));
    }
  };

  const handleButtonAndroidClick = (): void => {
    const jsonData: {
      name: string;
    } = {
      name: "Toggle",
    };

    sendDataToAndroid(jsonData);
  };

  const sendJSONDataToiOS = (jsonData: { name: string; }): void => {
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

      console.log(err);
    }
  };

  const handleReceivedJSONIOS = (data: string): void => {
    setData(data);
  };

  const handlerIOSClick = (): void => {
    sendJSONDataToiOS({
      name: "Toggle",
    });
  };

  useEffect(() => {
    window.addEventListener("message", handleReceiveDataFromAndroid);
    window.handleReceivedJSON = handleReceivedJSONIOS;

    return () => {
      window.removeEventListener("message", handleReceiveDataFromAndroid);
    };
  }, []);

  return (
    <>
      <div style={{ marginBottom: 30 }}>
        <button onClick={handleButtonAndroidClick}>
          click me to open a popup from Android native side.
        </button>
      </div>
      <div>
        <button onClick={handlerIOSClick}>
          click me to open a popup from IOS native side.
        </button>
      </div>
      {data && <h1>Hello from Native side: {JSON.stringify(data)}</h1>}
    </>
  );
};

export default App;