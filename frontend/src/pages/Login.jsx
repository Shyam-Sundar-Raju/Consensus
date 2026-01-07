import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      login(res.data.token); // Save token to Context + LocalStorage
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-box">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to access your workspace</p>
        </div>
        <div className="form-group">
          <Input 
            placeholder="Email" 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <Input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Sign In"}
        </Button>
        <div className="auth-footer">
          New here? <Link to="/register" className="link">Create Account</Link>
        </div>
      </Card>
    </div>
  );
}