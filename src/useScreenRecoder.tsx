import { useState, useEffect } from "react";

export type Status =
  | "recording"
  | "idle"
  | "error"
  | "stopped"
  | "paused"
  | "permission-requested";

const useScreenRecorder = ({
  options,
  audio,
}: {
  options?: MediaRecorderOptions;
  audio?: boolean;
}) => {
  const [blobScreenUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const [blobScreen, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<any>();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [statusScreen, setStatus] = useState<Status>("permission-requested");
  const [streams, setStreams] = useState<{
    audio?: MediaStreamTrack | null;
    screen?: MediaStreamTrack | null;
  }>({ audio: null, screen: null });

  useEffect(() => {
    if (!mediaRecorder) return;
    mediaRecorder.ondataavailable = (event) => {
      const url = window.URL.createObjectURL(event.data);
      setBlobUrl(url);
      setBlob(event.data);
    };
  }, [mediaRecorder]);

  const requestScreenMediaStream = async () => {
    try {
      // @ts-ignore
      let displayMedia = await navigator.mediaDevices.getDisplayMedia();

      // @ts-ignore
      let tracks: MediaStreamTrack[] = [];
      let userMedia: MediaStream | null = null;
      if (audio) {
        userMedia = await navigator.mediaDevices.getUserMedia({ audio: true });
        tracks = [...displayMedia?.getTracks(), ...userMedia?.getTracks()];
      }
      if (tracks) setStatus("idle");
      const stream: MediaStream = new MediaStream(tracks);
      const mediaRecorder = new MediaRecorder(stream, options);
      setMediaRecorder(mediaRecorder);
      setStreams({
        audio:
          userMedia?.getTracks().find((track) => track.kind === "audio") ||
          null,
        screen:
          displayMedia
            .getTracks()
            .find((track: MediaStreamTrack) => track.kind === "video") || null,
      });

      return mediaRecorder;
    } catch (e) {
      setError(e);
      setStatus("error");
    }
    return;
  };

  const stopScreenRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.stop();

    setStatus("stopped");

    mediaRecorder.stream.getTracks().map((track) => track.stop());
    setMediaRecorder(null);
  };

  const startScreenRecording = async () => {
    let recorder = mediaRecorder;
    if (!mediaRecorder) {
      recorder = await requestScreenMediaStream();
    }
    (recorder as MediaRecorder).start();
    setStatus("recording");
  };

  const pauseScreenRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.pause();
    setStatus("paused");
  };

  const resumeScreenRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.resume();
    setStatus("recording");
  };

  const resetScreenRecording = () => {
    setBlobUrl(undefined);
    setError(null);
    setMediaRecorder(null);
    setStatus("idle");
  };

  return {
    blobScreen,
    blobScreenUrl,
    error,
    pauseScreenRecording,
    resetScreenRecording,
    resumeScreenRecording,
    startScreenRecording,
    statusScreen,
    stopScreenRecording,
    streams,
  };
};

export default useScreenRecorder;
