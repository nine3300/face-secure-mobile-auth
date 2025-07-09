
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Shield, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FaceScanner from '@/components/FaceScanner';

const FaceCapture = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = async (faceData: string) => {
    setCapturedImage(faceData);
    setIsCapturing(false);
    setIsProcessing(true);

    // Simulate face encoding and storage
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast({
      title: "Face data captured!",
      description: "Your biometric profile has been secured"
    });

    // Auto redirect after success
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCapturing(true);
  };

  if (isCapturing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center">
                <Camera className="h-6 w-6 mr-2" />
                Capture Your Face
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FaceScanner
                onCapture={handleCapture}
                onCancel={() => setIsCapturing(false)}
                isLoading={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 mr-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">FaceSecure Setup</h1>
          </div>
          <p className="text-blue-100">Welcome, {user?.name}!</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            {capturedImage ? (
              <div className="text-center space-y-6">
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto"></div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Processing...</h3>
                      <p className="text-blue-200">Securing your biometric data</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-500/20 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Success!</h3>
                      <p className="text-blue-200">Your face has been securely registered</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-white/10 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                  <Camera className="h-10 w-10 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Set up Face Recognition</h3>
                  <p className="text-blue-200 mb-6">
                    Capture your face to enable secure biometric login. This helps protect your account and makes signing in faster.
                  </p>

                  <div className="bg-blue-600/20 rounded-lg p-4 mb-6">
                    <p className="text-blue-100 text-sm">
                      <strong>Privacy Note:</strong> Your facial data is encrypted and stored securely. It never leaves our secure servers and is only used for authentication.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsCapturing(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capture Face
                  </Button>

                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    Skip for Now
                  </Button>
                </div>

                <p className="text-blue-300 text-xs">
                  You can set this up later in your account settings
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {capturedImage && !isProcessing && (
          <div className="mt-4 text-center">
            <Button
              onClick={handleRetake}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Retake Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceCapture;
