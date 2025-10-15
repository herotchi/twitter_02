import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { useEffect, useState } from "react";

type Tweet = {
    id: number;
    content: string;
    created_at: string;
};

const API_URL = 'http://localhost:8000/api/tweets';

function App() {
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
        const res = await fetch(`${API_URL}?page=${pageNum}`);
        const data = await res.json();
        // Laravel paginate()のレスポンスは { data: [...], next_page_url: "...", ... } 形式
        const tweetsData = data.data || [];

        // 次ページがない場合は hasMore を false に
        setHasMore(!!data.next_page_url);

        if (pageNum === 1) {
            setTweets(tweetsData);
        } else {
            setTweets(prev => [...prev, ...tweetsData]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        //if (!content.trim()) return;

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        if (!res.ok) {
            const data = await res.json();
            console.log(data);

            let message = "投稿に失敗しました";

            if (data.errors) {
                // Laravel のエラー構造に対応（オブジェクトの場合）
                const allErrors = Object.values(data.errors)
                    .flat() // 各フィールドのエラーメッセージ配列をフラット化
                    .join("、"); // 日本語で区切る
                message = allErrors;
            } else if (typeof data.message === "string") {
                message = data.message;
            }

            setErrorMessage(message);
            return;
        }

        setContent("");
        setPage(1);
        setHasMore(true);
        fetchTweets(1);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTweets(nextPage);
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h1 className="mb-4 text-center">Mini Twitter</h1>

                    {/* ツイート投稿フォーム */}
                    <Card className="mb-4">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
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
                                    <div className="alert alert-danger mt-2" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <Button type="submit" variant="primary" className="mt-2">
                                    ツイート
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* ツイート一覧 */}
                    {tweets.map(tweet => (
                        <Card key={tweet.id} className="mb-2">
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
    );
}

export default App;
