
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Scan, Lock, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Military-grade facial recognition security'
    },
    {
      icon: Scan,
      title: 'Face Recognition',
      description: 'Login in seconds with just your face'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your biometric data stays encrypted and secure'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect experience on any device'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mr-3">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">FaceSecure</h1>
        </div>
        <p className="text-blue-100 text-lg">Next-generation biometric authentication</p>
      </div>

      {/* Features Grid */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="text-center space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/signup')}
                size="lg"
                className="w-full max-w-sm bg-white text-blue-900 hover:bg-blue-50 font-semibold py-4 text-lg"
              >
                Get Started
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline"
                size="lg"
                className="w-full max-w-sm border-white/30 text-white hover:bg-white/10 font-semibold py-4 text-lg"
              >
                Sign In
              </Button>
            </div>
            
            <p className="text-blue-200 text-sm mt-6">
              Secure • Private • Fast
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 text-center">
        <p className="text-blue-300 text-sm">
          © 2024 FaceSecure Mobile. Your security is our priority.
        </p>
      </div>
    </div>
  );
};

export default Index;
