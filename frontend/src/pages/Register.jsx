import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-box">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Get started with your free account</p>
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
        <Button className="w-full" onClick={handleRegister} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </Button>
        <div className="auth-footer">
          Already have an account? <Link to="/" className="link">Login</Link>
        </div>
      </Card>
    </div>
  );
}