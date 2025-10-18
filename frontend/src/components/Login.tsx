import { useState } from "react";
import axios from "../lib/axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

interface LoginProps {
    onLoginSuccess: () => void;
    onGoRegister: () => void;
}

export default function Login({ onLoginSuccess, onGoRegister }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | string[] | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await axios.get("/sanctum/csrf-cookie");
            await axios.post("/auth/login", {
                email,
                password,
            });
            onLoginSuccess();
        } catch (error: any) {
            const data = error.response?.data;
            if (data?.errors) {
                // { email: [...], password: [...] } → ["メールアドレスは必須です。", "パスワードは必須です。"]
                const messages = (Object.values(data.errors) as string[][]).flat();
                setError(messages);
            } else if (data?.message) {
                setError(data.message);
            } else {
                setError("ログインに失敗しました。");
            }
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center align-items-center">
                <Col md={6}>
                    <Card className="p-4 mt-5 shadow-lg rounded-4">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">ログイン</Card.Title>
                            <Form onSubmit={handleLogin} noValidate>
                                <Form.Group className="mb-3" controlId="loginEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="メールアドレス"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="loginPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="パスワード"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button type="submit" className="w-100 mb-2" variant="primary">
                                    ログイン
                                </Button>
                            </Form>
                            {error && (
                                <div className="alert alert-danger">
                                    {Array.isArray(error) ? (
                                        <ul className="mb-0">
                                            {error.map((msg, idx) => (
                                                <li key={idx}>{msg}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mb-0">{error}</p>
                                    )}
                                </div>
                            )}
                            <div className="text-center mt-2">
                                <Button variant="link" onClick={onGoRegister}>
                                    新規登録はこちら
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container >
    );
}
