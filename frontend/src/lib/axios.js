import axios from "axios";

//axios.defaults.baseURL = "https://1944yamao-ka.sakura.ne.jp/shout/backend"; // Laravel側のURL
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
//axios.defaults.xsrfCookieName = "ENC_XSRF-TOKEN";
//axios.defaults.xsrfCookieName = "XSRF-TOKEN";
//axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
axios.defaults.headers = {
  "Content-Type": "application/json",
};

export default axios;
