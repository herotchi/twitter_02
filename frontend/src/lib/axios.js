import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"; // Laravel側のURL
axios.defaults.withCredentials = true; // Cookieを送信して認証を維持
axios.defaults.withXSRFToken = true;

export default axios;
