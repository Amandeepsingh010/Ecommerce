import React, { useState } from 'react';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

function Register({ navigate }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { api } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please verify your email.');
            localStorage.setItem('pendingVerificationEmail', formData.email);
            navigate('otp', '/otp');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-visual">
                <div className="auth-visual-content">
                    <h1 className="auth-visual-title">Join LUXE</h1>
                    <p className="auth-visual-text">Start your luxury shopping journey</p>
                </div>
            </div>
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">LUXE</div>
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Join the premium shopping experience</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-input"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                className="form-input"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="9876543210"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account →'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or sign up with</span>
                    </div>

                    <div className="social-login">
                        <button className="btn btn-outline">Google</button>
                        <button className="btn btn-outline">Facebook</button>
                    </div>

                    <p className="auth-footer">
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="auth-link"
                            onClick={() => navigate('login', '/login')}
                        >
                            Sign in →
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;