// src/App.tsx
import React, { useEffect, useState } from "react";
import axios from "./lib/axios";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import { Spinner } from "react-bootstrap";

type User = { id: number; name: string; email: string } | null;

const App: React.FC = () => {
    const [user, setUser] = useState<User>(null);
    const [showRegister, setShowRegister] = useState(false);
    const [showProfileEdit, setProfileEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await axios.get("/auth/user");
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // ローディング中：中央にスピナー表示
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" role="status" />
                    <div className="mt-3 text-muted">ユーザー情報を確認中...</div>
                </div>
            </div>
        );
    }

    // ログイン状態による表示切り替え
    if (!user) {
        if (showRegister) {
            return (
                <Register
                    onRegisterSuccess={() => fetchUser()}
                    onGoLogin={() => setShowRegister(false)}
                />
            );
        }

        return (
            <Login
                onLoginSuccess={() => fetchUser()}
                onGoRegister={() => setShowRegister(true)}
            />
        );
    }

    if (showProfileEdit) {
        return (
            <Profile
                user={user}
                onLogout={() => fetchUser()}
                onGoProfile={() => setProfileEdit(true)}
                onGoDashboard={() => setProfileEdit(false)}
                onProfileEditSuccess={() => fetchUser()}
                onPasswordEditSuccess={() => fetchUser()}
            />
        );
    }

    return (
        <Dashboard
            user={user}
            onLogout={() => fetchUser()}
            onGoProfile={() => setProfileEdit(true)}
            onGoDashboard={() => setProfileEdit(false)}
        />
    );
};

export default App;
