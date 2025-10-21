// src/components/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Trash } from "lucide-react";

type DashboardProps = {
    user: { id: number; name: string; email: string } | null;
    onLogout: () => Promise<void>;
};

type Tweet = {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
};

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {

    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [content, setContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 初回読み込み
    useEffect(() => {
        fetchTweets(1);
    }, []);

    const fetchTweets = async (pageNum: number) => {
        try {
            const res = await axios.get("/tweets", {
                params: { page: pageNum },
            });
            const data = res.data.data || [];

            if (data.length < 5) setHasMore(false);

            if (pageNum === 1) {
                setTweets(data);
            } else {
                setTweets(prev => [...prev, ...data]);
            }
        } catch (error) {
            console.error('ツイートの取得に失敗しました:', error);
        }
    };

    const handleTweet = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        // if (!content.trim()) return;

        try {
            await axios.post("/tweets", { content });

            // 成功時
            setContent("");
            setPage(1);
            setHasMore(true);
            fetchTweets(1);
        } catch (error: any) {
            //console.error('投稿に失敗しました:', error);
            console.log(error.response.data.errors);

            // サーバー側のエラーメッセージがある場合
            if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors).flat();
                setErrorMessage(messages.join("、"));
            } else {
                setErrorMessage("投稿に失敗しました");
            }
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTweets(nextPage);
    };

    // ツイート削除
    const handleDelete = async (id: number) => {
        if (!window.confirm("このシャウトを削除しますか？")) return;

        try {
            await axios.delete(`/tweets/${id}`);
            setTweets((prev) => prev.filter((tweet) => tweet.id !== id));
        } catch (error) {
            //console.error(error);
            alert("削除に失敗しました。");
        }
    };

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
                    </div>
                </div>
            </nav>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>

                        {/* ツイート投稿フォーム */}
                        <Card className="mb-4">
                            <Card.Body>
                                <Form onSubmit={handleTweet}>
                                    <Form.Group controlId="tweetTextarea">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="いまどうしてる？"
                                            value={content}
                                            onChange={e => setContent(e.target.value)}
                                        />
                                    </Form.Group>
                                    {errorMessage && (
                                        <div className="alert alert-danger mt-3 mb-0" role="alert">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <Button type="submit" variant="primary" className="mt-3 w-100">
                                        シャウト
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* ツイート一覧 */}
                        {tweets.map(tweet => (
                            <Card key={tweet.id} className="mb-2">
                                <Button
                                    variant="link"
                                    className="position-absolute top-0 end-0 text-danger p-2"
                                    onClick={() => handleDelete(tweet.id)}
                                    title="削除"
                                >
                                    <Trash size={16} />
                                </Button>
                                <Card.Body>
                                    <Card.Text>{tweet.content}</Card.Text>
                                    <Card.Subtitle className="text-muted" style={{ fontSize: "0.8rem" }}>
                                        {new Date(tweet.created_at).toLocaleString()}
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        ))}

                        {/* 続きを見る */}
                        {hasMore && (
                            <div className="text-center mt-3">
                                <Button variant="outline-secondary" onClick={handleLoadMore}>
                                    続きを見る
                                </Button>
                            </div>
                        )}
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

export default Dashboard;
