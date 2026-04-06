import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { api } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard/stats'),
                api.get('/admin/orders'),
                api.get('/products'),
                api.get('/admin/users')
            ]);
            
            setStats(statsRes.data.data);
            setOrders(ordersRes.data.data);
            setProducts(productsRes.data.data?.content || []);
            setUsers(usersRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/admin/orders/${orderId}/status?status=${status}`);
            toast.success('Order status updated');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const deleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/admin/products/${productId}`);
                toast.success('Product deleted');
                fetchDashboardData();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'orders', label: 'Orders', icon: '📦', badge: stats.pendingOrders },
        { id: 'products', label: 'Products', icon: '🛍️' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    const getStatusClass = (status) => {
        const classes = {
            'DELIVERED': 'status-delivered',
            'PENDING': 'status-pending',
            'PROCESSING': 'status-processing',
            'SHIPPED': 'status-shipped',
            'CANCELLED': 'status-cancelled'
        };
        return classes[status] || 'status-pending';
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">LUXE</div>
                    <p>Admin Panel</p>
                </div>
                <nav className="sidebar-nav">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <div className="admin-header">
                    <h1 className="admin-title">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    <div className="admin-actions">
                        <button className="btn btn-outline">📥 Export</button>
                        {activeTab === 'products' && (
                            <button className="btn btn-primary">+ Add Product</button>
                        )}
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-label">Total Revenue</div>
                                <div className="stat-value">₹{stats.totalRevenue?.toLocaleString() || '0'}</div>
                                <div className="stat-change up">↑ +18.2% this month</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📦</div>
                                <div className="stat-label">Total Orders</div>
                                <div className="stat-value">{stats.totalOrders || 0}</div>
                                <div className="stat-change up">↑ +12.5%</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-label">Customers</div>
                                <div className="stat-value">{stats.totalUsers || 0}</div>
                                <div className="stat-change up">↑ +8.1%</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🛍️</div>
                                <div className="stat-label">Products</div>
                                <div className="stat-value">{stats.totalProducts || 0}</div>
                                <div className="stat-change">In stock</div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="admin-table-container">
                            <h3>Recent Orders</h3>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order.id}>
                                            <td>{order.orderNumber}</td>
                                            <td>{order.user?.fullName}</td>
                                            <td>₹{order.totalAmount?.toLocaleString()}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td>
                                                <button className="action-btn">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'orders' && (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.orderNumber}</td>
                                        <td>{order.user?.fullName}</td>
                                        <td>{order.items?.length || 0} items</td>
                                        <td>₹{order.totalAmount?.toLocaleString()}</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={`status-select ${getStatusClass(order.status)}`}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>
                                            <button className="action-btn">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="product-cell">
                                                <span className="product-emoji-small">{product.emoji}</span>
                                                {product.name}
                                            </div>
                                        </td>
                                        <td>{product.brand}</td>
                                        <td>₹{product.price?.toLocaleString()}</td>
                                        <td>
                                            <span className={product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}>
                                                {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td>{product.rating} ★</td>
                                        <td>
                                            <button className="action-btn edit">Edit</button>
                                            <button className="action-btn delete" onClick={() => deleteProduct(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Verified</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber || '-'}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={async (e) => {
                                                    try {
                                                        await api.put(`/admin/users/${user.id}/role?role=${e.target.value}`);
                                                        toast.success('User role updated');
                                                        fetchDashboardData();
                                                    } catch (error) {
                                                        toast.error('Failed to update role');
                                                    }
                                                }}
                                            >
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td>{user.emailVerified ? '✅' : '❌'}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;