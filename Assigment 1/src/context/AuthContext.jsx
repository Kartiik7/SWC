import { createContext, useState, useEffect } from 'react';
import { getStorageUsers, saveStorageUsers } from '../services/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from storage
    const loadedUsers = getStorageUsers();
    setUsers(loadedUsers);

    // Check session for logged-in user
    const sessionUser = sessionStorage.getItem('cineverse_current_user');
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'User not found. Use mock accounts: user@cineverse.com, owner@cineverse.com, admin@cineverse.com' };
    }
    if (user.status === 'Blocked') {
      return { success: false, message: 'Your account has been blocked by the Administrator.' };
    }
    // For convenience of testing, we accept 'password123' as password
    if (password !== 'password123') {
      return { success: false, message: 'Invalid password. Try "password123"' };
    }

    setCurrentUser(user);
    sessionStorage.setItem('cineverse_current_user', JSON.stringify(user));
    return { success: true, user };
  };

  const signup = (name, email, password, role = 'user') => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser = {
      id: 'u_' + Date.now(),
      name,
      email,
      role,
      status: 'Active',
      phone: '',
      address: ''
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveStorageUsers(updatedUsers);

    setCurrentUser(newUser);
    sessionStorage.setItem('cineverse_current_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('cineverse_current_user');
  };

  const updateProfile = (profileData) => {
    if (!currentUser) return { success: false, message: 'No logged in user.' };

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...profileData };
      }
      return u;
    });

    const updatedCurrentUser = { ...currentUser, ...profileData };
    setUsers(updatedUsers);
    saveStorageUsers(updatedUsers);
    setCurrentUser(updatedCurrentUser);
    sessionStorage.setItem('cineverse_current_user', JSON.stringify(updatedCurrentUser));
    
    return { success: true };
  };

  const blockUser = (userId) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Blocked' ? 'Active' : 'Blocked';
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(updatedUsers);
    saveStorageUsers(updatedUsers);

    // If the blocked user is currently logged in, force logout or session check
    if (currentUser && currentUser.id === userId) {
      logout();
    }
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    saveStorageUsers(updatedUsers);

    if (currentUser && currentUser.id === userId) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      blockUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
