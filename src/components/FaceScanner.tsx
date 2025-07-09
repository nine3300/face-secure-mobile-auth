
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Check, X } from 'lucide-react';

interface FaceScannerProps {
  onCapture: (faceData: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const FaceScanner: React.FC<FaceScannerProps> = ({ onCapture, onCancel, isLoading }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  }, []);

  // Capture image from video stream
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    // Ensure video is ready and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video not ready - no dimensions');
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    console.log('Capturing image:', { 
      videoWidth: video.videoWidth, 
      videoHeight: video.videoHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    });

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    console.log('Captured image data length:', imageData.length);
    
    setCapturedImage(imageData);

    // Stop camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  // Start camera scan with countdown
  const startScan = useCallback(async () => {
    await initCamera();
    setIsScanning(true);
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Capture image after countdown with additional delay to ensure video is ready
          setTimeout(() => {
            captureImage();
            setIsScanning(false);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initCamera, captureImage]);

  // Handle file input for demo purposes
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCountdown(0);
    setIsScanning(false);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <div className="space-y-6">
      {/* Camera View */}
      <div className="relative bg-black/50 rounded-lg overflow-hidden aspect-square">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured face" 
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {/* Live camera feed */}
            {cameraStream && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {cameraError ? (
                <div className="text-center text-white">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-red-400 mb-2">{cameraError}</p>
                  <p className="text-sm">Please allow camera access and try again</p>
                </div>
              ) : isScanning ? (
                <div className="text-center">
                  <div className="relative">
                    {countdown > 0 ? (
                      <div className="text-6xl font-bold text-white animate-pulse drop-shadow-lg">
                        {countdown}
                      </div>
                    ) : (
                      <div className="text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white mx-auto mb-2"></div>
                        <p className="drop-shadow-lg">Capturing...</p>
                      </div>
                    )}
                  </div>
                  {countdown > 0 && (
                    <p className="text-white/80 text-sm mt-4 drop-shadow-lg">Keep your face in the circle</p>
                  )}
                </div>
              ) : !cameraStream ? (
                <div className="text-center text-white/60">
                  <Camera className="h-16 w-16 mx-auto mb-4" />
                  <p>Click "Start Face Scan" to begin</p>
                  <p className="text-sm mt-2">Position your face in the center</p>
                </div>
              ) : null}
            </div>

            {/* Face detection circle overlay when scanning */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-4 border-green-400 rounded-full animate-pulse drop-shadow-lg"></div>
              </div>
            )}
          </>
        )}

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-white/80 text-sm mb-4">
          {capturedImage 
            ? "Review your photo and confirm if it looks good"
            : "Make sure your face is well-lit and centered in the frame"
          }
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-3">
        {capturedImage ? (
          <div className="flex space-x-3">
            <Button
              onClick={handleRetake}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              <Check className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={startScan}
              disabled={isScanning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Start Face Scan'}
            </Button>
            
            {/* Demo file upload option */}
            <div className="text-center">
              <p className="text-white/60 text-xs mb-2">Demo Mode: Upload a photo</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Choose File
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={onCancel}
          variant="ghost"
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default FaceScanner;
