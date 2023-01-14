import React, { useEffect, useState } from "react";
import Pill from "./Pill";
import useScreenRecorder from "./useScreenRecoder";
import useVideoRecorder from "./useVideoRecorder";

const VideoRecorder: React.FC = () => {
  const [isAudio, setIsAudio] = useState<boolean>(true);
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const {
    startRecording,
    pauseRecording,
    blobUrl,
    resetRecording,
    resumeRecording,
    status,
    stopRecording,
    mediaRecorder,
    toggleAudio,
    toggleVideo,

    // streams,
  } = useVideoRecorder({ video: true, audio: true });

  const videoRef = React.createRef<HTMLVideoElement>();

  const {
    startScreenRecording,
    pauseScreenRecording,
    blobScreenUrl,
    resetScreenRecording,
    resumeScreenRecording,
    statusScreen,
    stopScreenRecording,
  } = useScreenRecorder({ audio: true });

  const screenRef = React.createRef<HTMLVideoElement>();

  useEffect(() => {
    if (mediaRecorder) {
      videoRef.current!.srcObject = mediaRecorder.stream;
    }
  }, [mediaRecorder, videoRef]);

  return (
    <>
      <div id="container">
        <div className="wrapper">
          <div className="pills">
            <Pill title="Status" value={status} />
            <Pill
              style={{ flexGrow: 1 }}
              title="Blob URL"
              value={blobUrl || "Waiting..."}
            />
          </div>

          <div className="buttons">
            {(status === "idle" ||
              status === "permission-requested" ||
              status === "error") && (
              <button onClick={startRecording}>Start Video recording</button>
            )}
            {(status === "recording" || status === "paused") && (
              <button onClick={stopRecording}>Stop Video recording</button>
            )}
            {(status === "recording" || status === "paused") && (
              <button
                onClick={() =>
                  status === "paused" ? resumeRecording() : pauseRecording()
                }
              >
                {status === "paused" ? "Resume recording" : "Pause recording"}
              </button>
            )}
            {status === "stopped" && (
              <button
                onClick={() => {
                  resetRecording();
                  videoRef.current!.load();
                }}
              >
                Reset recording
              </button>
            )}
            {blobUrl && (
              <>
                <a href={blobUrl} download>
                  Download {blobUrl}
                </a>
              </>
            )}
            <video
              ref={videoRef}
              id="gum"
              controls
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={() => {
                //
                setIsAudio((prevState) => !prevState);
                toggleAudio();
              }}
            >
              {isAudio ? "Mute" : "Unmute"}
            </button>
            <button
              onClick={() => {
                setIsVideo((prevState) => !prevState);
                toggleVideo();
              }}
            >
              {isVideo ? "Hide video" : "Show video"}
            </button>
            <button onClick={() => {}}>Record Screen</button>
          </div>
        </div>
      </div>
      <div id="container">
        <div className="wrapper">
          <div className="pills">
            <Pill title="Status" value={statusScreen} />
            <Pill
              style={{ flexGrow: 1 }}
              title="Blob URL"
              value={blobUrl || "Waiting..."}
            />
          </div>

          <div className="buttons">
            {(statusScreen === "idle" ||
              statusScreen === "permission-requested" ||
              statusScreen === "error") && (
              <button
                onClick={() => {
                  toggleAudio();
                  startScreenRecording();
                }}
              >
                Start Screen recording
              </button>
            )}
            {(statusScreen === "recording" || statusScreen === "paused") && (
              <button
                onClick={() => {
                  toggleAudio();
                  stopScreenRecording();
                }}
              >
                Stop Screen recording
              </button>
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
                  screenRef.current!.load();
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
    </>
  );
};

export default VideoRecorder;
