// src/components/Dashboard.tsx
import React from "react";
import axios from "../lib/axios";
import { Nav, Navbar, Container, NavDropdown, Button } from "react-bootstrap";

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
        <>
            <nav className="navbar navbar-expand-sm bg-body-tertiary bg-dark border-bottom border-bottom-dark mb-3" data-bs-theme="dark">
                <div className="container-fluid">
                    <span className="navbar-brand">ロバの耳</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="ms-auto">
                            <button className="d-flex btn btn-outline-success" onClick={handleLogout}>ログアウト</button>
                        </div>
                    </div >
                </div >
            </nav >
        </>
        /*<div>
            <h2>ようこそ、{user?.name}さん！</h2>
            <p>{user?.email}</p>
            <button onClick={handleLogout}>ログアウト</button>
        </div>*/
    );
};

export default Dashboard;
