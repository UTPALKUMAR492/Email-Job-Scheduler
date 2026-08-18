import { GoogleLogin } from "@react-oauth/google";

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Login with Google</p>

        <div className="google-login-wrap">
          <GoogleLogin
            text="signin_with"
            shape="rectangular"
            theme="filled_blue"
            onSuccess={(credentialResponse) => {
              const token = credentialResponse.credential;
              if (!token) return;

              const payload = JSON.parse(atob(token.split(".")[1]));

              onLogin({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
              });
            }}
            onError={() => alert("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
}
