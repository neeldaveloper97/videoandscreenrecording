import React, { useState } from "react";
import ScreenRecorder from "./ScreenRecorder";
import VideoRecorder from "./VideoRecorder";

const App: React.FC = () => {
  return (
    <div>
      {/* <button onClick={() => setActiveTab("screen")}>screen</button>
      <button onClick={() => setActiveTab("video")}>video</button> */}
      <VideoRecorder />
    </div>
  );
};
export default App;
