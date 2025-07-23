import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import './AdminPage.css';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userProfile } = useAuth();

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            toast.error("Could not fetch users. Are you an owner?");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        const toastId = toast.loading(`Updating role for user...`);
        try {
            await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success("Role updated successfully!", { id: toastId });
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update role.", { id: toastId });
        }
    };

    if (isLoading) return <p>Loading user management panel...</p>;

    return (
        <>
            <header className="main-header">
                <h2>Admin Panel</h2>
                <p>Manage users and roles for VibeStream.</p>
            </header>
            <div className="admin-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Current Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            // Tambahkan kelas khusus jika baris ini adalah milik owner
                            <tr key={user.id} className={user.id === userProfile?.id ? 'owner-row' : ''}>
                                <td data-label="User ID">{user.id}</td>
                                <td data-label="Username">{user.username || 'N/A'}</td>
                                <td data-label="Current Role">
                                    <span className={`role-tag role-${user.role}`}>{user.role}</span>
                                </td>
                                <td data-label="Actions">
                                    {user.id !== userProfile?.id ? (
                                        <select 
                                            defaultValue={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="role-select"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        // Jika sama, tampilkan teks atau tidak sama sekali
                                        <span className="self-role-text">- Cannot be changed -</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminPage;