import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";

export default function App() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  useEffect(() => {
    const initPasskey = async () => {
      if (
        window.PublicKeyCredential &&
        (await PublicKeyCredential.isConditionalMediationAvailable?.())
      ) {
        await authClient.signIn.passkey({ autoFill: true });
      }
    };
    initPasskey();
  }, []);

  const handleMagicLink = async () => {
    setIsPending(true);
    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: window.location.origin,
    });
    setIsPending(false);
    if (error) setMessage(`エラー: ${error.message}`);
    else setMessage("ログインメールを送信しました！");
  };

  const handleAddPasskey = async () => {
    const { error } = await authClient.passkey.addPasskey({
      name: `My Device (${new Date().toLocaleDateString()})`,
    });
    if (error) alert(error.message);
    else
      alert("パスキーを登録しました！次回から指紋や顔認証でログインできます。");
  };

  if (isSessionLoading) return <p>読み込み中...</p>;

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>My Auth App</h1>

      {session ? (
        /* --- ログイン済みの画面 --- */
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <p>
            ようこそ: <strong>{session.user.email}</strong>
          </p>
          <button onClick={handleAddPasskey} style={btnStyle}>
            この端末をパスキー登録する
          </button>
          <button
            onClick={() => authClient.signOut()}
            style={{ ...btnStyle, backgroundColor: "#666" }}
          >
            ログアウト
          </button>
        </div>
      ) : (
        /* --- 未ログインの画面 --- */
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            autoComplete="username webauthn"
            style={{ padding: "10px" }}
          />

          <button
            onClick={handleMagicLink}
            disabled={isPending}
            style={btnStyle}
          >
            {isPending ? "送信中..." : "Magic Linkでログイン"}
          </button>

          <div style={{ textAlign: "center", margin: "10px 0" }}>または</div>

          <button
            onClick={() => authClient.signIn.passkey()}
            style={{ ...btnStyle, backgroundColor: "#000" }}
          >
            パスキー(指紋・顔認証)でログイン
          </button>

          {message && <p style={{ color: "blue" }}>{message}</p>}
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "10px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "10px",
};
