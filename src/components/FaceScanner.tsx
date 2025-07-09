
import { useState, useRef, useCallback } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate camera countdown
  const startScan = useCallback(() => {
    setIsScanning(true);
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Simulate capture after countdown
          setTimeout(() => {
            const mockImageData = `data:image/jpeg;base64,${Date.now()}`;
            setCapturedImage(mockImageData);
            setIsScanning(false);
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

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
          <div className="w-full h-full flex items-center justify-center">
            {isScanning ? (
              <div className="text-center">
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-white/30 rounded-full mb-4 mx-auto"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {countdown > 0 ? (
                      <div className="text-4xl font-bold text-white animate-pulse">
                        {countdown}
                      </div>
                    ) : (
                      <div className="text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white mx-auto mb-2"></div>
                        <p>Capturing...</p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-white/80 text-sm">Keep your face in the circle</p>
              </div>
            ) : (
              <div className="text-center text-white/60">
                <Camera className="h-16 w-16 mx-auto mb-4" />
                <p>Camera preview will appear here</p>
                <p className="text-sm mt-2">Position your face in the center</p>
              </div>
            )}
          </div>
        )}

        {/* Face detection overlay when scanning */}
        {isScanning && countdown === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-4 border-green-400 rounded-full animate-pulse"></div>
          </div>
        )}
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
