// src/components/Register.tsx
import React, { useState } from "react";
import axios from "../lib/axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

type RegisterProps = {
    onRegisterSuccess: () => Promise<void>;
    onGoLogin: () => void;
};

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onGoLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState<string | string[] | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.get("/sanctum/csrf-cookie");
            await axios.post("/auth/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setSuccess("ユーザー登録に成功しました。🎉");
            await onRegisterSuccess();
        } catch (error: any) {
            const data = error.response?.data;
            if (data?.errors) {
                // { email: [...], password: [...] } → ["メールアドレスは必須です。", "パスワードは必須です。"]
                const messages = (Object.values(data.errors) as string[][]).flat();
                setError(messages);
            } else if (data?.message) {
                setError(data.message);
            } else {
                setError("登録に失敗しました。");
            }
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center align-items-center">
                <Col md={6}>
                    <Card className="p-4 mt-5 shadow-lg rounded-4">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">ユーザー登録</Card.Title>
                            <Form onSubmit={handleRegister} noValidate>
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
                                <Form.Group className="mb-3" controlId="regsterPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="パスワード"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="regsterPasswordConfirmation">
                                    <Form.Control
                                        type="password"
                                        placeholder="パスワード（確認）"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button type="submit" className="w-100 mb-2" variant="primary">
                                    登録
                                </Button>
                            </Form>
                            {success && (
                                <div className="alert alert-success mt-3 mb-0 text-center">
                                    {success}
                                </div>
                            )}

                            {error && (
                                <div>
                                    {Array.isArray(error)
                                        ? error.map((msg, idx) => (
                                            <div key={idx} className="alert alert-danger mb-2">{msg}</div>
                                        ))
                                        : <div className="alert alert-danger">{error}</div>
                                    }
                                </div>
                            )}
                            <div className="text-center mt-2">
                                <p>すでにアカウントをお持ちですか？</p>
                                <Button variant="link" onClick={onGoLogin}>
                                    ログインへ
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
