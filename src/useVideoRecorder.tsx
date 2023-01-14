import { useState, useEffect } from "react";

export type Status =
  | "recording"
  | "idle"
  | "error"
  | "stopped"
  | "paused"
  | "permission-requested";

interface IUseVideoRecorder {
  options?: MediaRecorderOptions;
  video?: boolean;
  audio?: boolean;
}
const useVideoRecorder = ({ options, video, audio }: IUseVideoRecorder) => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<any>();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [status, setStatus] = useState<Status>("permission-requested");
  const [streams, setStreams] = useState<{
    video: MediaStreamTrack | null;
  }>({ video: null });

  const requestMediaStream = async () => {
    try {
      // @ts-ignore
      // let displayMedia = await navigator.mediaDevices.getUserMedia({
      //   audio,
      // });

      let userMedia: MediaStream | null = null;

      if (video) {
        userMedia = await navigator.mediaDevices.getUserMedia({ video, audio });
      }

      // @ts-ignore
      let tracks: MediaStreamTrack[] = [];
      if (userMedia) {
        tracks = [...userMedia.getTracks()];
      }
      if (tracks) setStatus("idle");
      const stream: MediaStream = new MediaStream(tracks);
      const mediaRecorder = new MediaRecorder(stream, options);
      setMediaRecorder(mediaRecorder);
      setStreams({
        // audio:
        //   // @ts-ignore
        //   userMedia.getTracks().find((track) => track.kind === "audio") || null,
        video:
          userMedia!
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
  const stopRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.stop();

    setStatus("stopped");

    mediaRecorder.stream.getTracks().map((track) => track.stop());
    setMediaRecorder(null);
  };

  const toggleAudio = () => {
    if (mediaRecorder) {
      const audioTrack = mediaRecorder.stream.getAudioTracks();
      audioTrack.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleVideo = () => {
    if (mediaRecorder) {
      const videoTrack = mediaRecorder.stream.getVideoTracks();
      videoTrack.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const startRecording = async () => {
    let recorder = mediaRecorder;
    if (!mediaRecorder) {
      recorder = await requestMediaStream();
    }
    (recorder as MediaRecorder).start();
    setStatus("recording");
  };

  const pauseRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.pause();
    setStatus("paused");
  };

  const resumeRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.resume();
    setStatus("recording");
  };

  const resetRecording = () => {
    setBlobUrl(undefined);
    setError(null);
    setMediaRecorder(null);
    setStatus("idle");
  };

  useEffect(() => {
    if (!mediaRecorder) return;
    mediaRecorder.ondataavailable = (event) => {
      const url = window.URL.createObjectURL(event.data);
      setBlobUrl(url);
      setBlob(event.data);
    };
  }, [mediaRecorder]);

  return {
    blob,
    blobUrl,
    error,
    pauseRecording,
    resetRecording,
    resumeRecording,
    startRecording,
    status,
    stopRecording,
    streams,
    mediaRecorder,
    toggleAudio,
    toggleVideo,
  };
};

export default useVideoRecorder;
