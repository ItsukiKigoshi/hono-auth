import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

export const PasskeyAuth = () => {
  const [error, setError] = useState<string | null>(null);

  // 1. Conditional UI (オートフィル) の有効化
  useEffect(() => {
    const initConditionalUI = async () => {
      if (
        window.PublicKeyCredential &&
        await PublicKeyCredential.isConditionalMediationAvailable?.()
      ) {
        // ブラウザの入力補完にパスキーを表示させる
        await authClient.signIn.passkey({ 
          autoFill: true 
        });
      }
    };
    initConditionalUI();
  }, []);

  // 2. 新規パスキーの登録 (ログイン済みである必要あり)
  const handleAddPasskey = async () => {
      const { data, error } = await authClient.passkey.addPasskey({
        name: "マイデバイス",
      });
  
      if (error) {
        // error.message が undefined の場合に備えて空文字やデフォルト文言を入れる
        // また、message が文字列であることを保証するために String() で囲むか || を使う
        setError(String(error.message || "パスキーの登録に失敗しました"));
      } else {
        alert("パスキーを登録しました！");
      }
    };


  // 3. パスキーでログイン
  const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.passkey({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/dashboard";
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        }
      }
    });
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">パスキー認証</h2>
      
      {/* オートフィル用の隠し、または表示入力フォーム */}
      <div className="flex flex-col gap-2">
        <label>ユーザー名（オートフィル用）</label>
        <input 
          type="text" 
          name="username" 
          autoComplete="username webauthn" 
          className="border p-2"
        />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          パスキーでログイン
        </button>

        <button 
          onClick={handleAddPasskey}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          新しいパスキーを登録
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
