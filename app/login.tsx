import {StyleSheet, Text, View} from "react-native";
import {Button, TextInput} from "react-native-paper";
import React, {Component, useEffect, useState} from 'react';
import {makeRedirectUri, useAuthRequest} from "expo-auth-session";
import * as Google from 'expo-auth-session/providers/google';

interface User {
    username: string,
    password: string,
}

export const UserContext = React.createContext<User | null>(null)

const endpoints = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};

export default function LoginScreen() {
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    const [request, response, promptGoogle] = Google.useAuthRequest({
        expoClientId: '32bf68cf-39a3-439c-868b-b9fe33b93446',
        androidClientId: 'f4fb2216-39de-459a-9c62-b002beac3482.apps.googleusercontent.com',
        iosClientId: '8762b860-c0d1-4591-a512-5c0d68e07fb0.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === "success") {
            setToken(response.authentication!!.accessToken);
            getUserInfo();
        }
    }, [response, token]);

    const getUserInfo = async () => {
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const user = await response.json();
            setUserInfo(user);
        } catch (error) {
            // Add your own error handler here
        }
    };

    return (
        <Button style={styles.button} disabled={!request} onPress={() => {promptGoogle()}}>Google</Button>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 500
    }
})