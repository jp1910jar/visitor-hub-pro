import { useEffect, useRef, useState } from "react";
import { Camera, X, RotateCcw, Check } from "lucide-react";

export function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Camera access was denied, or no camera is available."));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function takeSnapshot() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontally so the saved photo matches the mirrored live preview.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    setCaptured(canvas.toDataURL("image/jpeg", 0.9));
  }

  function handleClose() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-foreground">Take a photo</h3>
          <button
            onClick={handleClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl bg-black">
          {error ? (
            <div className="flex h-64 items-center justify-center p-4 text-center text-[13px] text-white/80">
              {error}
            </div>
          ) : (
            <>
              {/* Video stays mounted at all times - only hidden via CSS when
                  showing the captured preview. Unmounting it (conditional
                  render) would lose the getUserMedia stream on retake. */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full scale-x-[-1] ${captured ? "hidden" : ""}`}
              />
              {captured ? (
                <img src={captured} alt="Captured preview" className="w-full" />
              ) : null}
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-5 flex justify-end gap-3">
          {error ? (
            <button
              onClick={handleClose}
              className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Close
            </button>
          ) : captured ? (
            <>
              <button
                onClick={() => setCaptured(null)}
                className="inline-flex items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <RotateCcw className="size-4" aria-hidden />
                Retake
              </button>
              <button
                onClick={() => captured && onCapture(captured)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Check className="size-4" aria-hidden />
                Use Photo
              </button>
            </>
          ) : (
            <button
              onClick={takeSnapshot}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Camera className="size-4" aria-hidden />
              Capture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}