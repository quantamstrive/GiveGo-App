import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import PixelButton from './components/PixelButton';
import PixelCard from './components/PixelCard';
import VolunteerDashboard from './components/VolunteerDashboard';
import NGODashboard from './components/NGODashboard';

// Main Auth/App Wrapper
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginStep, setLoginStep] = useState<'LOGIN' | 'ROLE' | 'DETAILS'>('LOGIN');
  const [tempRole, setTempRole] = useState<UserRole | null>(null);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orgName: '',
    regNumber: ''
  });

  const handleGoogleLogin = () => {
    // Simulate Google Login
    setTimeout(() => {
      setLoginStep('ROLE');
    }, 800);
  };

  const handleRoleSelect = (role: UserRole) => {
    setTempRole(role);
    setLoginStep('DETAILS');
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempRole) return;

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name || 'Anonymous User',
      email: formData.email || 'user@gmail.com',
      role: tempRole,
      phone: formData.phone,
      organizationName: formData.orgName,
      registrationNumber: formData.regNumber,
      verified: tempRole === UserRole.NGO // Auto verify for demo
    };

    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setLoginStep('LOGIN');
    setTempRole(null);
    setFormData({ name: '', email: '', phone: '', orgName: '', regNumber: '' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden crt">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>

        <div className="z-10 w-full max-w-md">
          {/* Logo removed as per request */}
          
          <h1 className="text-6xl text-center mb-8 font-bold text-glow tracking-tighter text-white">GiveGo</h1>
          
          <PixelCard>
            {loginStep === 'LOGIN' && (
              <div className="text-center space-y-6">
                <p className="text-xl mb-4 text-white">IDENTIFY YOURSELF</p>
                <PixelButton onClick={handleGoogleLogin} className="w-full">
                  <span className="mr-2">G</span> LOGIN WITH GOOGLE
                </PixelButton>
                <div className="text-xs text-gray-500 mt-4">SECURE CONNECTION V.2.0.4</div>
              </div>
            )}

            {loginStep === 'ROLE' && (
              <div className="text-center space-y-6">
                <p className="text-xl mb-4 text-white">CHOOSE YOUR PATH</p>
                <div className="grid grid-cols-1 gap-4">
                  <PixelButton onClick={() => handleRoleSelect(UserRole.VOLUNTEER)}>
                    I AM A VOLUNTEER
                  </PixelButton>
                  <PixelButton variant="secondary" onClick={() => handleRoleSelect(UserRole.NGO)}>
                    I AM AN NGO
                  </PixelButton>
                </div>
              </div>
            )}

            {loginStep === 'DETAILS' && (
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <p className="text-xl mb-4 text-center text-white">INITIALIZATION</p>
                
                <div>
                  <label className="block text-sm mb-1 text-gray-400">FULL DESIGNATION (NAME)</label>
                  <input required type="text" className="w-full bg-black border border-gray-500 p-2 focus:border-white focus:outline-none text-white"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm mb-1 text-gray-400">COMM LINK (EMAIL)</label>
                  <input required type="email" className="w-full bg-black border border-gray-500 p-2 focus:border-white focus:outline-none text-white"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                {tempRole === UserRole.VOLUNTEER && (
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">PHONE / WHATSAPP</label>
                    <input required type="tel" className="w-full bg-black border border-gray-500 p-2 focus:border-white focus:outline-none text-white"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                )}

                {tempRole === UserRole.NGO && (
                  <>
                    <div>
                      <label className="block text-sm mb-1 text-gray-400">ORG NAME</label>
                      <input required type="text" className="w-full bg-black border border-gray-500 p-2 focus:border-white focus:outline-none text-white"
                        value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-400">REGISTRATION ID</label>
                      <input required type="text" className="w-full bg-black border border-gray-500 p-2 focus:border-white focus:outline-none text-white"
                        value={formData.regNumber} onChange={e => setFormData({...formData, regNumber: e.target.value})} />
                    </div>
                    {/* Mock File Upload */}
                    <div className="border border-dashed border-gray-500 p-4 text-center cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-xs text-gray-400">UPLOAD VERIFICATION DOCS (MOCK)</span>
                    </div>
                  </>
                )}

                <PixelButton type="submit" className="w-full mt-6">ESTABLISH LINK</PixelButton>
              </form>
            )}
          </PixelCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white crt">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/90 border-b-2 border-white backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-glow cursor-pointer">GiveGo</div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-sm bg-white/20 px-2 py-1 rounded">
            USER: {user.name.toUpperCase()} [{user.role}]
          </span>
          <PixelButton onClick={handleLogout} className="px-3 py-1 text-sm" variant="secondary">
            LOGOUT
          </PixelButton>
        </div>
      </nav>

      <main className="p-4 max-w-7xl mx-auto">
        {user.role === UserRole.VOLUNTEER ? (
          <VolunteerDashboard user={user} />
        ) : (
          <NGODashboard user={user} />
        )}
      </main>
    </div>
  );
};

export default App;