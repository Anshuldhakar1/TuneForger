"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Play, Eye, EyeOff, User, Headphones, Music, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginProps {
  isDarkMode: boolean;
}

const Login = ({ isDarkMode }: LoginProps) => {
  const { signIn } = useAuthActions();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    // Only pass email and password to backend
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // const username = formData.get("username") as string; // Not sent to backend

    try {
      await signIn("password", {
        email,
        password,
        flow: isLogin ? "signIn" : "signUp",
      });
      // Optionally: toast.success("Signed in!");
    } catch (error: any) {
      let toastTitle = "";
      if (error.message?.includes("Invalid password")) {
        toastTitle = "Invalid password. Please try again.";
      } else {
        toastTitle =
          isLogin
            ? "Could not sign in, did you mean to sign up?"
            : "Could not sign up, did you mean to sign in?";
      }
      toast.error(toastTitle);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength(0);
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    return "Strong";
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 flex items-center justify-center p-4 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-green-900"
          : "bg-gradient-to-br from-green-50 via-white to-green-50"
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-green-500/10" : "bg-green-200/30"
          }`}
        />
        <div
          className={`absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
            isDarkMode ? "bg-green-400/10" : "bg-green-300/20"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/4 w-4 h-4 rounded-full animate-bounce delay-500 ${
            isDarkMode ? "bg-green-400/60" : "bg-green-400"
          }`}
        />
        <div
          className={`absolute top-1/3 right-1/4 w-2 h-2 rounded-full animate-bounce delay-700 ${
            isDarkMode ? "bg-green-500/60" : "bg-green-500"
          }`}
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        {/* <div className="text-center mb-8 animate-fade-in"> */}
        <div className="text-center mb-8">
          <span
            className={`inline-flex items-center gap-2 text-2xl font-bold transition-colors ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            TuneForge
          </span>
          <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {isLogin ? "Welcome back to your music journey" : "Start your AI-powered music journey"}
          </p>
        </div>

        {/* Auth Card */}
        {/* className={`border-0 shadow-xl animate-slide-up transition-all duration-300 ${
            isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
          }`} */}
        <Card
          className={`border-0 shadow-xl transition-all duration-300 ${
            isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
          }`}
        >
          <CardHeader className="text-center pb-6">
            <CardTitle
              className={`text-2xl font-bold transition-all duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription
              className={`transition-all duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {isLogin
                ? "Enter your email and password to access your playlists"
                : "Join thousands of music lovers using AI curation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name - Only for Signup */}
              {!isLogin && (
                <div className="space-y-2 animate-slide-down">
                  <Label
                    htmlFor="name"
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={`pl-10 h-12 transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                          : "border-gray-200 focus:border-green-500 focus:ring-green-500"
                      }`}
                      // Not sent to backend
                    />
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Username - Only for Signup, commented out */}
              {/* 
              {!isLogin && (
                <div className="space-y-2 animate-slide-down">
                  <Label
                    htmlFor="username"
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a unique username"
                      className={`pl-10 h-12 transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                          : "border-gray-200 focus:border-green-500 focus:ring-green-500"
                      }`}
                      // Not sent to backend
                    />
                    <Music
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              )}
              */}

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`pl-10 h-12 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                        : "border-gray-200 focus:border-green-500 focus:ring-green-500"
                    }`}
                    required
                  />
                  <Music
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                    className={`pl-10 pr-10 h-12 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                        : "border-gray-200 focus:border-green-500 focus:ring-green-500"
                    }`}
                    onChange={!isLogin ? handlePasswordChange : undefined}
                    required
                  />
                  <Headphones
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                      isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength - Only for Signup */}
                {!isLogin && passwordStrength > 0 && (
                  <div className="space-y-1 animate-slide-down">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength
                              ? getStrengthColor(passwordStrength)
                              : isDarkMode
                                ? "bg-gray-600"
                                : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs ${
                        passwordStrength >= 3 ? "text-green-600" : isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Password strength: {getStrengthText(passwordStrength)}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password - Only for Signup */}
              {!isLogin && (
                <div className="space-y-2 animate-slide-down">
                  <Label
                    htmlFor="confirmPassword"
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 h-12 transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                          : "border-gray-200 focus:border-green-500 focus:ring-green-500"
                      }`}
                      required
                    />
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                        isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me - Only for Login */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleAuthMode}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;