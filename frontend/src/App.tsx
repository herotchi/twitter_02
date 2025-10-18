// src/App.tsx
import React, { useEffect, useState } from "react";
import axios from "./lib/axios";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

type User = { id: number; name: string; email: string } | null;

const App: React.FC = () => {
    const [user, setUser] = useState<User>(null);
    const [showRegister, setShowRegister] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await axios.get("/auth/user");
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

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

    return <Dashboard user={user} onLogout={() => fetchUser()} />;
};

export default App;
