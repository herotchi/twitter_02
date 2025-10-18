// src/components/Dashboard.tsx
import React from "react";
import axios from "../lib/axios";

type DashboardProps = {
    user: { id: number; name: string; email: string } | null;
    onLogout: () => Promise<void>;
};

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const handleLogout = async () => {
        await axios.post("/auth/logout");
        await onLogout();
    };

    return (
        <div>
            <h2>ようこそ、{user?.name}さん！</h2>
            <p>{user?.email}</p>
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    );
};

export default Dashboard;
