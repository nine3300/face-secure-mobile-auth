
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Scan, Settings, LogOut, Camera, Lock, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You have been securely logged out"
    });
    navigate('/');
  };

  const stats = [
    {
      title: 'Security Level',
      value: user?.hasFaceData ? 'High' : 'Medium',
      icon: Shield,
      color: user?.hasFaceData ? 'text-green-400' : 'text-yellow-400'
    },
    {
      title: 'Face Recognition',
      value: user?.hasFaceData ? 'Active' : 'Not Set',
      icon: Scan,
      color: user?.hasFaceData ? 'text-green-400' : 'text-red-400'
    },
    {
      title: 'Login Method',
      value: user?.hasFaceData ? 'Biometric' : 'Password',
      icon: Lock,
      color: 'text-blue-400'
    },
    {
      title: 'Account Status',
      value: 'Verified',
      icon: Activity,
      color: 'text-green-400'
    }
  ];

  const quickActions = [
    {
      title: 'Setup Face Recognition',
      description: 'Enable biometric login for faster access',
      icon: Camera,
      action: () => navigate('/face-capture'),
      show: !user?.hasFaceData
    },
    {
      title: 'Security Settings',
      description: 'Manage your account security preferences',
      icon: Settings,
      action: () => toast({ title: "Coming soon", description: "Security settings will be available soon" })
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information',
      icon: User,
      action: () => toast({ title: "Coming soon", description: "Profile settings will be available soon" })
    }
  ].filter(action => action.show !== false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FaceSecure</h1>
                <p className="text-blue-200 text-sm">Dashboard</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-blue-200">
            Your account is secured with {user?.hasFaceData ? 'biometric' : 'password'} authentication
          </p>
        </div>

        {/* Security Status Alert */}
        {!user?.hasFaceData && (
          <Card className="bg-yellow-500/10 border-yellow-500/20 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-yellow-500/20 rounded-full p-2 mr-3">
                  <Scan className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Enhance Your Security</h3>
                  <p className="text-yellow-200 text-sm">Set up face recognition for faster and more secure login</p>
                </div>
                <Button
                  onClick={() => navigate('/face-capture')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Set Up Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-white/10 rounded-full p-3`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <div className="bg-blue-600/20 rounded-full p-2 mr-3">
                    <action.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm mb-4">{action.description}</p>
                <Button
                  onClick={action.action}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Tips */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-200 text-sm">
              <div className="flex items-start">
                <div className="bg-green-500/20 rounded-full p-1 mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-white">Keep your face data secure</p>
                  <p>Your biometric data is encrypted and never shared</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500/20 rounded-full p-1 mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-white">Use strong passwords</p>
                  <p>Combine face recognition with a strong password</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
