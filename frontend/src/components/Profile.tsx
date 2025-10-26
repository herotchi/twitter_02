import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";

type ProfileProps = {
    user: { id: number; name: string; email: string } | null;
    onLogout: () => Promise<void>;
    onGoProfile: () => void;
    onGoDashboard: () => void;
    onProfileEditSuccess: () => Promise<void>;
    onPasswordEditSuccess: () => Promise<void>;
};

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onGoProfile, onGoDashboard, onProfileEditSuccess, onPasswordEditSuccess }) => {

    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [currentPasswordForProfile, setCurrentPasswordForProfile] = useState("");
    const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [profileError, setProfileError] = useState<string | string[] | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | string[] | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    const handleProfileEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);

        try {
            //await axios.get("/sanctum/csrf-cookie");
            await axios.patch("/profile/update", {
                name,
                email,
                currentPasswordForProfile,
            });
            setProfileSuccess("プロフィール変更に成功しました。🎉");
            await onProfileEditSuccess();
        } catch (error: any) {
            const data = error.response?.data;
            if (data?.errors) {
                // { email: [...], password: [...] } → ["メールアドレスは必須です。", "パスワードは必須です。"]
                const messages = (Object.values(data.errors) as string[][]).flat();
                setProfileError(messages);
            } else if (data?.message) {
                setProfileError(data.message);
            } else {
                setProfileError("プロフィール変更に失敗しました。");
            }
        }
    }

    const handlePasswordEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        try {
            //await axios.get("/sanctum/csrf-cookie");
            await axios.patch("/profile/password", {
                currentPasswordForPassword,
                password,
                password_confirmation: passwordConfirmation,
            });
            setPasswordSuccess("パスワード変更に成功しました。🎉");
            await onPasswordEditSuccess();
        } catch (error: any) {
            console.log(error);
            console.log(password);
            console.log(passwordConfirmation);
            const data = error.response?.data;
            if (data?.errors) {
                // { email: [...], password: [...] } → ["メールアドレスは必須です。", "パスワードは必須です。"]
                const messages = (Object.values(data.errors) as string[][]).flat();
                setPasswordError(messages);
            } else if (data?.message) {
                setPasswordError(data.message);
            } else {
                setPasswordError("パスワード変更に失敗しました。");
            }
        }
    }

    const handleLogout = async () => {
        await axios.post("/auth/logout");
        await onLogout();
    };

    return (
        <>
            <nav className="navbar navbar-expand-sm bg-body-tertiary bg-dark border-bottom border-bottom-dark mb-3" data-bs-theme="dark">
                <div className="container-fluid">
                    <Button variant="link" className="navbar-brand" onClick={onGoDashboard}>王様の耳はロバの耳</Button>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                            <li className="nav-item">
                                <Button variant="link" onClick={onGoProfile} className="nav-link">
                                    {user?.name}
                                </Button>
                            </li>
                        </ul>
                        <div className="ms-auto">
                            <button className="d-flex btn btn-outline-success" onClick={handleLogout}>ログアウト</button>
                        </div>
                    </div>
                </div>
            </nav>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="shadow-lg rounded-4">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">プロフィール変更</Card.Title>
                                <Form onSubmit={handleProfileEdit} noValidate>
                                    <Form.Group className="mb-3" controlId="regsterName">
                                        <Form.Control
                                            type="text"
                                            placeholder="ユーザー名"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="regsterEmail">
                                        <Form.Control
                                            type="email"
                                            placeholder="メールアドレス"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="currentPasswordForProfile">
                                        <Form.Control
                                            type="password"
                                            placeholder="現在のパスワード"
                                            value={currentPasswordForProfile}
                                            onChange={(e) => setCurrentPasswordForProfile(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" className="w-100 mb-2" variant="primary">
                                        変更
                                    </Button>
                                </Form>
                                {profileSuccess && (
                                    <div className="alert alert-success mt-3 mb-0 text-center">
                                        {profileSuccess}
                                    </div>
                                )}

                                {profileError && (
                                    <div>
                                        {Array.isArray(profileError)
                                            ? profileError.map((msg, idx) => (
                                                <div key={idx} className="alert alert-danger mb-2">{msg}</div>
                                            ))
                                            : <div className="alert alert-danger">{profileError}</div>
                                        }
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="justify-content-center mb-5">
                    <Col md={6}>
                        <Card className="mt-5 shadow-lg rounded-4">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">パスワード変更</Card.Title>
                                <Form onSubmit={handlePasswordEdit} noValidate>
                                    <Form.Group className="mb-3" controlId="currentPasswordForPassword">
                                        <Form.Control
                                            type="password"
                                            placeholder="現在のパスワード"
                                            value={currentPasswordForPassword}
                                            onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Control
                                            type="password"
                                            placeholder="新しいパスワード"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="passwordConfirmation">
                                        <Form.Control
                                            type="password"
                                            placeholder="新しいパスワード（確認）"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button type="submit" className="w-100 mb-2" variant="primary">
                                        変更
                                    </Button>
                                </Form>
                                {passwordSuccess && (
                                    <div className="alert alert-success mt-3 mb-0 text-center">
                                        {passwordSuccess}
                                    </div>
                                )}

                                {passwordError && (
                                    <div>
                                        {Array.isArray(passwordError)
                                            ? passwordError.map((msg, idx) => (
                                                <div key={idx} className="alert alert-danger mb-2">{msg}</div>
                                            ))
                                            : <div className="alert alert-danger">{passwordError}</div>
                                        }
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
        /*<div>
            <h2>ようこそ、{user?.name}さん！</h2>
            <p>{user?.email}</p>
            <button onClick={handleLogout}>ログアウト</button>
        </div>*/
    );
};

export default Profile;
