import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, AsyncStorage, TextInput } from "react-native";
import { globalStyles } from "../styles/global";
import * as AppAuth from "expo-app-auth";
import * as Application from 'expo-application'

export default function Login() {
  let [authState, setAuthState] = useState(null);
  let [createAccountId, setCreateAccountId] = useState(null);
  let [creatingAccount, setCreatingAccount] = useState(false);
  let [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      let cachedAuth = await getCachedAuthAsync();
      if (cachedAuth && !authState) {
        setAuthState(cachedAuth);
      }
    })();
  }, []);

  let loginSignup = <Button
                      style={globalStyles.button}
                      title="Sign In with Google"
                      onPress={async () => {
                        const _authState = await signInAsync();
                        setAuthState(_authState);
                        if (true) // search for sub not on database
                        {
                          setCreateAccountId(await requestSub());
                          await signOutAsync(_authState);
                          setAuthState(null);
                          setCreatingAccount(true);
                        }
                      }}
                    />

  if (authState) {
    loginSignup = <Button
                    style={globalStyles.button}
                    title="Sign Out"
                    onPress={async () => {
                      await signOutAsync(authState);
                      setAuthState(null);
                    }}
                  />
  }

  if(!creatingAccount) {
    return (
      <View style={globalStyles.container}>
        {loginSignup}
      </View>
    )
  } else {
    return (
      <View style={globalStyles.container}>
        <Text>Username:</Text>
        <TextInput 
          style={globalStyles.input} 
          onChangeText={text => setUsername(text)} 
          value={username} 
        />
        <Button
          style={globalStyles.button}
          title="Create Account"
          onPress={async() => {
            // check if username is taken
            // if not create new user with username and createAccountId
            console.log(`Create new account ${username} | ${createAccountId}`);
          }}
        />
      </View>
    )
  }
}

let config = {
  issuer: 'https://accounts.google.com',
  scopes: ['email'],
  clientId: '460355842723-bsr9a76tc6i4d2k63km9q5db5hii80bm.apps.googleusercontent.com',
};

let StorageKey = '@RSVPme:GoogleOAuthKey';

export async function signInAsync() {
  let authState = await AppAuth.authAsync(config);
  await cacheAuthAsync(authState);
  return authState;
}

async function cacheAuthAsync(authState) {
  return await AsyncStorage.setItem(StorageKey, JSON.stringify(authState));
}

export async function getCachedAuthAsync() {
  let value = await AsyncStorage.getItem(StorageKey);
  let authState = JSON.parse(value);
  if(authState) {
    if(checkIfTokenExpired(authState)) {
      return refreshAuthAsync(authState);
    } else {
      return authState;
    }
  }
  return null;
}

function checkIfTokenExpired({ accessTokenExpirationDate }) {
  return new Date(accessTokenExpirationDate) < new Date();
}

async function refreshAuthAsync({ refreshToken }) {
  let authState = await AppAuth.refreshAsync(config, refreshToken);
  await cacheAuthAsync(authState);
  return authState;
}

export async function signOutAsync({ accessToken }) {
  try {
    await AppAuth.revokeAsync(config, {
      token: accessToken,
      isClientIdProvided: true,
    });
    await AsyncStorage.removeItem(StorageKey);
    return null;
  } catch(e) {
    alert(`Failed to revoke token: ${e.message}`);
  }
}

export async function requestSub() {
  var authState = await getCachedAuthAsync()
  if(authState) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${authState['accessToken']}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    return fetch("https://www.googleapis.com/oauth2/v3/userinfo", requestOptions).then(
      response => response.text()
    ).then(
      result => "google:".concat(JSON.parse(result)["sub"])
    ).catch(
      error => console.log('error', error)
    );
  }
  return null;
}