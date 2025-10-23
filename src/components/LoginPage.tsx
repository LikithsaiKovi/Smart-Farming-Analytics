import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiService } from "../services/api";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [error, setError] = useState("");
  const [registrationStep, setRegistrationStep] = useState<'form' | 'otp'>('form');

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.sendOTP(email);
      if (response.success) {
        setOtpSent(true);
        setOtpExpiresIn(response.data?.expiresIn || 600);
        toast.success("OTP sent to your email!");
        
        // Start countdown
        const countdown = setInterval(() => {
          setOtpExpiresIn(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              setOtpSent(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.error || "Failed to send OTP");
        toast.error(response.error || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!email || !otp) {
      setError("Please enter both email and OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.verifyOTP(email, otp);
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success("Login successful!");
        onLogin();
      } else {
        setError(response.error || "Invalid OTP");
        toast.error(response.error || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !farmSize) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.register(name, email, parseInt(farmSize));
      if (response.success) {
        setRegistrationStep('otp');
        setOtpSent(true);
        setOtpExpiresIn(response.data?.expiresIn || 600);
        toast.success("OTP sent to your email for verification!");
        
        // Start countdown
        const countdown = setInterval(() => {
          setOtpExpiresIn(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              setOtpSent(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.error || "Registration failed");
        toast.error(response.error || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegistration = async () => {
    if (!email || !otp) {
      setError("Please enter both email and OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.verifyRegistration(email, otp);
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success("Account created successfully!");
        onLogin();
      } else {
        setError(response.error || "Invalid OTP");
        toast.error(response.error || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-primary mb-2">AgroAnalytics</h1>
            <p className="text-muted-foreground">
              Smart Agriculture Analytics Platform
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your email to receive a one-time password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}


                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="farmer@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <Button
                      onClick={handleSendOTP}
                      disabled={isLoading || !email}
                      className="w-full"
                      variant="outline"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP to my email"
                      )}
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">One-Time Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter OTP"
                            className="pl-10"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            OTP expires in: {formatTime(otpExpiresIn)}
                          </span>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm"
                            onClick={handleSendOTP}
                            disabled={isLoading}
                          >
                            Resend OTP
                          </Button>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        size="lg"
                        onClick={handleVerifyOTP}
                        disabled={isLoading || !otp}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    {registrationStep === 'form' 
                      ? 'Join thousands of farmers using smart analytics'
                      : 'Verify your email to complete account creation'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {registrationStep === 'form' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Farmer"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="farmer@example.com"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farm-size">Farm Size (acres)</Label>
                        <Input
                          id="farm-size"
                          type="number"
                          placeholder="100"
                          value={farmSize}
                          onChange={(e) => setFarmSize(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>

                      <Button
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        size="lg"
                        onClick={handleRegister}
                        disabled={isLoading || !name || !email || !farmSize}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            Send Verification Code
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-otp">Verification Code</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-otp"
                            type="text"
                            placeholder="Enter OTP"
                            className="pl-10"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            OTP expires in: {formatTime(otpExpiresIn)}
                          </span>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm"
                            onClick={handleRegister}
                            disabled={isLoading}
                          >
                            Resend OTP
                          </Button>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        size="lg"
                        onClick={handleVerifyRegistration}
                        disabled={isLoading || !otp}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Complete Registration
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1754106005357-2095d15fb965?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm0lMjBjcm9wc3xlbnwxfHx8fDE3NjEyMTI0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Agriculture field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white text-center"
          >
            <h2 className="text-4xl mb-4 text-white">
              Data-Driven Agriculture
            </h2>
            <p className="text-xl text-white/90 max-w-lg">
              Make informed decisions with real-time analytics, weather predictions,
              and AI-powered crop insights.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
