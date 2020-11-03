import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { AUTH_ENDPOINT, CREDENTIALS_NAME } from "../constants";

export const AuthContext = createContext();

export function useAuth() {
    const [ credentials, setCredentials ] = useState({ username: null, displayName: null, token: null });
    const [ error, setError ] = useState(null);
    const [ processing, setProcessing ] = useState(false);

    useEffect(() => {
        loadCredentials();
    }, []);

    async function login(username, password) {
        const loginInfo = { username: username, password: password };
        setProcessing(true);

        try {
            const response = await axios.post(`${AUTH_ENDPOINT}`, loginInfo)
            const token = response.headers['authorization'].replace("Bearer ", "");
            storeCredentials(token);
            setProcessing(false);
            setError(null);
        
        } catch (error) {
            console.error(error);
            setError("O login não pôde ser realizado.");
            setProcessing(false);
        }
    }

    function isAuthenticated() {
        return sessionStorage.getItem(CREDENTIALS_NAME) !== null;
    }

    function logout() {
        sessionStorage.removeItem(CREDENTIALS_NAME);
        setCredentials({ username: null, displayName: null, token: null });
    }

    function storeCredentials(token) {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const credentials = { username: tokenData.sub, displayName: tokenData.displayName, token: token };
        sessionStorage.setItem(CREDENTIALS_NAME, JSON.stringify(credentials));
        setCredentials(credentials);
    }

    function loadCredentials() {
        const storedCredentials = sessionStorage.getItem(CREDENTIALS_NAME);

        if (storedCredentials !== null) {
            setCredentials(JSON.parse(storedCredentials));
        }
    }

    return { login, logout, isAuthenticated, credentials, error, processing };

}