import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';
import Alert from './Alert';
import Spinner from './Spinner';

export function Login() {
    const auth = useContext(AuthContext);
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        
        auth.login(username, password);
    }
    
    if (auth.isAuthenticated()) {
        return <Redirect to="/tasks" />;
    }

    return (
        <div>
            <h1>Login</h1>
            <br/>
            {auth.error && <Alert message={auth.error}/>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Usuário</label>
                    <input 
                        type="text"
                        className="form-control"
                        onChange={(event) => setUsername(event.target.value)}
                        value={username}
                        placeholder="Digite o usuário..."/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input 
                        type="password"
                        className="form-control"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        placeholder="Digite a senha..." />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={auth.processing}
                    onSubmit={handleSubmit}>
                    Login
                </button>
                { auth.processing ? <Spinner /> : ""}
            </form>
        </div>
    );
}

export default Login;