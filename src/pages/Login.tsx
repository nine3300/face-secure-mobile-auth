
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Scan, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FaceScanner from '@/components/FaceScanner';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithFace, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showFaceLogin, setShowFaceLogin] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Login successful"
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  const handleFaceLogin = async (faceData: string) => {
    const success = await loginWithFace(faceData);
    
    if (success) {
      toast({
        title: "Face recognized!",
        description: "Login successful"
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Face not recognized",
        description: "Please try again or use email/password",
        variant: "destructive"
      });
    }
    setShowFaceLogin(false);
  };

  if (showFaceLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            onClick={() => setShowFaceLogin(false)}
            variant="ghost"
            className="text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center">
                <Scan className="h-6 w-6 mr-2" />
                Face Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FaceScanner
                onCapture={handleFaceLogin}
                onCancel={() => setShowFaceLogin(false)}
                isLoading={isLoading}
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
            <h1 className="text-2xl font-bold text-white">FaceSecure</h1>
          </div>
          <p className="text-blue-100">Sign in to your account</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Face Login Button */}
              <Button
                onClick={() => setShowFaceLogin(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                disabled={isLoading}
              >
                <Scan className="h-5 w-5 mr-2" />
                Sign in with Face
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-blue-200">Or continue with</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-10"
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-blue-200 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-blue-900 hover:bg-blue-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-blue-200 text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-white hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
