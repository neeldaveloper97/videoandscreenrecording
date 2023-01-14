import React, { useRef } from "react";
import Pill from "./Pill";
import useScreenRecorder from "./useScreenRecoder";

const ScreenRecorder: React.FC = () => {
  const {
    startScreenRecording,
    pauseScreenRecording,
    blobScreenUrl,
    resetScreenRecording,
    resumeScreenRecording,
    statusScreen,
    stopScreenRecording,
  } = useScreenRecorder({ audio: true });

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div id="container">
      <div className="wrapper">
        <div className="pills">
          <Pill title="Status" value={statusScreen} />
          <Pill
            style={{ flexGrow: 1 }}
            title="Blob URL"
            value={blobScreenUrl || "Waiting..."}
          />
        </div>

        <div className="buttons">
          {(statusScreen === "idle" ||
            statusScreen === "permission-requested" ||
            statusScreen === "error") && (
            <button onClick={startScreenRecording}>
              Start Screen recording
            </button>
          )}
          {(statusScreen === "recording" || statusScreen === "paused") && (
            <button onClick={stopScreenRecording}>Stop Screen recording</button>
          )}
          {(statusScreen === "recording" || statusScreen === "paused") && (
            <button
              onClick={() =>
                statusScreen === "paused"
                  ? resumeScreenRecording()
                  : pauseScreenRecording()
              }
            >
              {statusScreen === "paused"
                ? "Resume recording"
                : "Pause recording"}
            </button>
          )}
          {statusScreen === "stopped" && (
            <button
              onClick={() => {
                resetScreenRecording();
                videoRef.current!.load();
              }}
            >
              Reset recording
            </button>
          )}
          {blobScreenUrl && (
            <>
              <a href={blobScreenUrl} download>
                Download {blobScreenUrl}
              </a>
              {/* <video src={blobUrl} controls /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenRecorder;
