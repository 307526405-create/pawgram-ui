import { Camera, ChevronLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export function Scan() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [torch, setTorch] = useState(false);
  const [barcodeSupported] = useState(() => {
    // @ts-ignore
    return !!window.BarcodeDetector;
  });
  const streamRef = useRef<MediaStream | null>(null);
  const scanning = useRef(false);
  const detectorRef = useRef<any>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      // @ts-ignore
      if (window.BarcodeDetector) {
        // @ts-ignore
        detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      scanLoop();
    } catch (e: any) {
      setError(e.message || t('scan.cameraError'));
    }
  };

  const stopCamera = () => {
    scanning.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const scanLoop = async () => {
    scanning.current = true;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    while (scanning.current) {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        try {
          if (detectorRef.current) {
            const barcodes = await detectorRef.current.detect(canvas);
            if (barcodes.length > 0) {
              handleResult(barcodes[0].rawValue);
              return;
            }
          }
        } catch {}
      }
      await new Promise(r => setTimeout(r, 200));
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) {
        handleResult(code.data);
      } else {
        setError(t('scan.qrNotRecognized'));
      }
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
    e.target.value = '';
  };

  const handleResult = (text: string) => {
    stopCamera();
    setResult(text);
    if (/^https?:\/\//i.test(text)) {
      setTimeout(() => {
        window.open(text, '_blank');
        navigate(-1);
      }, 500);
    }
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: !torch }] });
      setTorch(!torch);
    } catch {}
  };

  return (
    <div className="h-full bg-black relative flex flex-col">
      <div className="absolute top-0 w-full pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 z-20">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-white"><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="text-[17px] font-bold text-white">{t('scan.title')}</h1>
        <button onClick={toggleTorch} className="p-2">
          <Zap className={`w-5 h-5 ${torch ? 'text-yellow-400' : 'text-white'}`} />
        </button>
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <p className="text-white/60 text-[15px] text-center mb-4">{error}</p>
          <button onClick={() => { setError(''); startCamera(); }} className="px-6 py-2 bg-white/20 text-white rounded-lg text-[14px]">{t('common.retry')}</button>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          <input ref={fileRef} type="file" capture="environment" accept="image/*" className="hidden" onChange={handlePhoto} />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-[240px] h-[240px] relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
            </div>
          </div>

          <p className="absolute bottom-[120px] left-0 right-0 text-center text-white/50 text-[13px] z-10">
            {barcodeSupported ? t('scan.autoScanHint') : ''}
          </p>

          {!barcodeSupported && (
            <div className="absolute bottom-[100px] left-0 right-0 flex justify-center z-20">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur text-white rounded-xl text-[14px] font-medium active:bg-white/30"
              >
                <Camera className="w-5 h-5" />
                {t('scan.takePhotoScan')}
              </button>
            </div>
          )}
        </>
      )}

      {result && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 px-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-[300px]">
            <p className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('scan.scanResult')}</p>
            <p className="text-[13px] text-[#666] dark:text-gray-400 break-all mb-5 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg p-3">{result}</p>
            <button onClick={() => { navigator.clipboard.writeText(result); }} className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg text-[14px] text-[#666] dark:text-gray-400 mb-2">{t('common.copy')}</button>
            <button onClick={() => { setResult(''); startCamera(); }} className="w-full h-10 bg-[#FF8C42] text-white rounded-lg text-[14px] font-bold">{t('scan.continueScan')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
