import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';
import style from "style/global.module.css"
import { useGoogleLogin, useGoogleLogout } from 'react-google-login';
import { serialize } from 'cookie';

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const { signIn } = useGoogleLogin({
        clientId: "391199147349-ee4g07ea3a08bsqglfar04vkhuofh9is.apps.googleusercontent.com",
        isSignedIn: true,
        accessType: 'offline',
        onSuccess,
        onFailure
    });

    const { signOut } = useGoogleLogout({
        clientId: "391199147349-ee4g07ea3a08bsqglfar04vkhuofh9is.apps.googleusercontent.com",
        onLogoutSuccess
    });

    function onLogoutSuccess() {
        setAuthenticated(false);
        setUser(null);
        document.cookie = `GOOGLE_DATA=;max-age=0;expires=${new Date().toDateString()}`
    }

    function onSuccess(response) {
        const { accessToken, googleId, profileObj : {email, name, imageUrl} } = response;
        const needed = { accessToken, googleId, email, name, imageUrl };
        document.cookie = serialize('GOOGLE_DATA', JSON.stringify(needed), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
        setUser(needed);
        setAuthenticated(true);
    }

    function onFailure(response) {
        console.log('GOOGLE LOGIN ERROR', response);
        setAuthenticated(false);
    }

    useEffect(() => {
        const cookie = document.cookie;
        if (cookie.split('GOOGLE_DATA=')[1]) {
            const data = JSON.parse(decodeURIComponent(cookie.split('GOOGLE_DATA=')[1]));
            setAuthenticated(true);
            setUser(data);
        }
    }, []);

    return (
        <section className={style.container}>
            {!authenticated && (
                    <div>
                        <h1 className={style.title}>Silahkan Login </h1>
                        <div className={style.centering}>
                            <button onClick={signIn} className={style.google_button}>
                                <span className={style.google_logo}></span>
                                Masuk dengan Google
                            </button>
                        </div>
                    </div>
            )}

            {authenticated && (
                <div>
                    <h1 className={style.title}>Selamat Datang {user.name} </h1>
                    <div className={style.centering}>
                        <button className={style.logout_button} onClick={signOut}>Logout</button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default hot(App);