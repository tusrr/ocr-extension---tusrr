/* global chrome */
import { useCallback, useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");

  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data } = await worker.recognize(selectedImage);
    setTextResult(data.text);
  }, [worker, selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, convertImageToText]);

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setTextResult("");
    }
  };

  // const captureScreenshot = () => {
  //   chrome.tabs.captureVisibleTab(null, {}, (screenshotUrl) => {
  //     console.log("Screenshot URL:", screenshotUrl);
  //     setSelectedImage(null); // Clear the selected image when capturing a screenshot
  //     setTextResult(""); // Clear the text result as well
  //     // Do whatever you want with the screenshotUrl, e.g., display it in an image element
  //   });
  // };
  const captureScreenshot = () => {
    chrome.tabs.captureVisibleTab(null, {}, (screenshotUrl) => {
      console.log("Screenshot URL:", screenshotUrl);

      // Display the screenshot in an image element
      const imgElement = document.createElement("img");
      imgElement.src = screenshotUrl;
      document.body.appendChild(imgElement);

      // Use the chrome.downloads.download API to initiate the download
      chrome.downloads.download({
        url: screenshotUrl,
        filename: "screenshot.jpg",
        saveAs: false, // Set to true if you want to prompt the user for a download location
      });

      setSelectedImage(null); // Clear the selected image when capturing a screenshot
      setTextResult(""); // Clear the text result as well
    });
  };

  return (
    <div className="App">
      <h1>OCR Extension </h1>
      <p>Gets words in image!</p>
      <div className="input-wrapper">
        <label htmlFor="upload">Upload Image</label>
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleChangeImage}
        />
        <button onClick={captureScreenshot}>Capture Screenshot</button>
      </div>

      <div className="result">
        {selectedImage && (
          <div className="box-image">
            <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
          </div>
        )}
        {textResult && (
          <div className="box-p">
            <p>{textResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
