import { useState } from "react";
import { authClient } from "./lib/auth-client";

function App() {
  const [email, setEmail] = useState("");
  const { data: session, isPending } = authClient.useSession();

  // Magic Link 送信
  const loginWithMagicLink = async () => {
    if (!email) {
      alert("メールアドレスを入力してね！");
      return;
    }

    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: import.meta.env.VITE_APP_URL,
      });

      if (error) {
        console.error("Auth Error:", error);
        alert(`送信に失敗したよ: ${error.message || "原因不明のエラーです"}`);
        return;
      }


      alert("メールを送信したよ！リンクをクリックして戻ってきてネ！");
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("通信に失敗しちゃった。サーバーが動いてるか確認してね。");
    }
  };

  // Passkey 登録（ログイン済みの場合）
  const registerPasskey = async () => {
    try {
      const { data, error } = await authClient.passkey.addPasskey({
        name: `${navigator} - ${new Date().toLocaleDateString()}`
      });

      if (error) {
        console.error("Passkey Error:", error);

        if (error.status === 401) {
          alert("セッションが切れちゃったみたい。もう一度ログインしてね！");
        } else {
          alert(`登録に失敗したよ: ${error.message || "原因不明のエラーです"}`);
        }
        return;
      }

      // 成功時
      alert("Passkeyの登録が完了したよ！次からは指紋や顔認証でログインできるね。");
      console.log("Registered Passkey:", data);

    } catch (err: any) {
      // ブラウザレベルのエラー（ユーザーによるキャンセルなど）
      // WebAuthn APIのエラーは 'NotAllowedError' (キャンセル) などがあります
      if (err.name === 'NotAllowedError') {
        console.warn("User cancelled the passkey registration.");
        // キャンセルの場合はalertを出さないのが一般的ですが、出すなら控えめに
        return;
      }

      console.error("Unexpected Browser Error:", err);
      alert("ブラウザでエラーが起きたよ。対応しているブラウザか確認してね。");
    }
  };

  // Passkey ログイン
  const loginWithPasskey = async () => {
    await authClient.signIn.passkey();
  };

  if (isPending) return <div>Loading...</div>;

  return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Better Auth + Vite</h1>

        {session ? (
            <div>
              <p>ログイン中: {session.user.email}</p>
              <button onClick={registerPasskey}>このデバイスにPasskeyを登録</button>
              <br /><br />
              <button onClick={() => authClient.signOut()}>ログアウト</button>
            </div>
        ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px", margin: "0 auto" }}>
              <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={loginWithMagicLink}>Magic Linkを送信</button>
              <hr />
              <button onClick={loginWithPasskey}>Passkeyでサインイン</button>
            </div>
        )}
      </div>
  );
}

export default App;