import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { quests } from "@/data/quests";
import { IconFlame, IconMapPin, IconClock } from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [forgotStatus, setForgotStatus] = useState("");

  // Check for reset token in URL on mount
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset");
    if (token) {
      setResetToken(token);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin ? { email, password } : { email, username, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Redirect to home on success - let React Router handle it, auth state will update via useEffect
      navigate("/");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setForgotStatus("If that email exists, a reset link has been sent. Please check your inbox.");
      setLoading(false);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setResetSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  // If we have a reset token, show reset password form
  if (resetToken && !resetSuccess) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="quest-out-theme">
        <div className="min-h-screen bg-[#0c0c0c] text-white">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c/0c0c]/95 backdrop-blur">
            <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconFlame className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold">Quest Out</span>
              </div>
              <Link to="/auth">
                <Button variant="ghost" className="text-white/70 hover:text-white">
                  Back to Auth
                </Button>
              </Link>
            </div>
          </header>

          <main className="mx-auto max-w-md px-4 py-16">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription className="text-zinc-400">
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  if (resetSuccess) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="quest-out-theme">
        <div className="min-h-screen bg-[#0c0c0c] text-white">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c/0c0c]/95 backdrop-blur">
            <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconFlame className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold">Quest Out</span>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-md px-4 py-16">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-green-500">Password Reset!</CardTitle>
                <CardDescription className="text-zinc-400">
                  Your password has been reset successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/auth">
                  <Button className="bg-orange-500 hover:bg-orange-600">Go to Login</Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="quest-out-theme">
      <div className="min-h-screen bg-[#0c0c0c] text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c/0c0c]/95 backdrop-blur">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconFlame className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">Quest Out</span>
            </div>
            <Link to="/">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Auth Form */}
        <main className="mx-auto max-w-md px-4 py-16">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {isLogin
                  ? "Sign in to continue your quest"
                  : "Start your adventure today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")}>
                <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-zinc-400 hover:text-orange-500 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="questmaster"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <Card className="bg-zinc-900 border-zinc-800 w-full max-w-md mx-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Reset Password</CardTitle>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError("");
                    setForgotStatus("");
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent>
                {forgotStatus ? (
                  <p className="text-green-500 text-sm">{forgotStatus}</p>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                      Enter your email and we'll send you a reset link.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        required
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}