import React, { useState } from 'react';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

function Login({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { api, setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { accessToken, refreshToken, fullName, role } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userName', fullName);
            localStorage.setItem('userRole', role);

            setUser({
                email,
                fullName,
                role
            });

            toast.success('Login successful!');
            
            if (role === 'ADMIN') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-visual">
                <div className="auth-visual-content">
                    <h1 className="auth-visual-title">Welcome Back</h1>
                    <p className="auth-visual-text">Experience luxury shopping at its finest</p>
                </div>
            </div>
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">LUXE</div>
                        <h2 className="auth-title">Sign In</h2>
                        <p className="auth-subtitle">Access your premium account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" /> Remember me
                            </label>
                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => navigate('forgot', '/forgot')}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-login">
                        <button className="btn btn-outline">Google</button>
                        <button className="btn btn-outline">Facebook</button>
                    </div>

                    <p className="auth-footer">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="auth-link"
                            onClick={() => navigate('register', '/register')}
                        >
                            Create one →
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;