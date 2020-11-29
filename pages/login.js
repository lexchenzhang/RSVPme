import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  AsyncStorage,
  TextInput,
} from "react-native";
import { globalStyles } from "../styles/global";
import * as AppAuth from "expo-app-auth";
import * as Application from "expo-application";
import axios from "axios";
import { set } from "react-native-reanimated";
const qs = require("qs");

export default function Login() {
  let [authState, setAuthState] = useState(null);
  let [createAccountId, setCreateAccountId] = useState(null);
  let [creatingAccount, setCreatingAccount] = useState(false);
  let [username, setUsername] = useState("");
  let [loading, setLoading] = useState(false);
  let [usernameTaken, setUsernameTaken] = useState(false);

  useEffect(() => {
    (async () => {
      let cachedAuth = await getCachedAuthAsync();
      if (cachedAuth && !authState) {
        setAuthState(cachedAuth);
      }
    })();
  }, []);

  let loginSignup = (
    <Button
      style={globalStyles.button}
      title="Sign In with Google"
      onPress={async () => {
        const _authState = await signInAsync();
        setAuthState(_authState);
        setLoading(true);
        // search for sub not on database
        let sub = await requestSub();
        let req = qs.stringify({
          uid: "1",
          appid: "capstone",
          access_token: "test_token",
          sign: "capstone",
          info: JSON.stringify({
            user_uid: sub,
          }),
        });
        axios
          .post(
            "https://www.splitvision.top/api/capstone/isUserExistByUID",
            req
          )
          .then(async function (response) {
            if (response.data.errno === 0) {
              setLoading(false);
            }
            if (response.data.errno === 4) {
              setCreateAccountId(await requestSub());
              await signOutAsync(_authState);
              setAuthState(null);
              setCreatingAccount(true);
              setLoading(false);
            }
          });
      }}
    />
  );

  if (authState) {
    loginSignup = (
      <Button
        style={globalStyles.button}
        title="Sign Out"
        onPress={async () => {
          await signOutAsync(authState);
          setAuthState(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={styles.headers}>Loading</Text>
      </View>
    );
  }
  if (!creatingAccount) {
    return <View style={globalStyles.container}>{loginSignup}</View>;
  } else {
    let inputStyle = globalStyles.input;
    if (usernameTaken) {
      inputStyle = globalStyles.badInput;
    }
    return (
      <View style={globalStyles.container}>
        <Text>Username:</Text>
        <TextInput
          style={inputStyle}
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <Button
          style={globalStyles.button}
          title="Create Account"
          onPress={async () => {
            // check if username is taken
            setLoading(true);
            let req = qs.stringify({
              uid: "1",
              appid: "capstone",
              access_token: "test_token",
              sign: "capstone",
              info: JSON.stringify({
                user_name: username,
              }),
            });
            axios
              .post(
                "https://www.splitvision.top/api/capstone/getUserByName",
                req
              )
              .then(async function (response) {
                if (response.data.errno === 0) {
                  setUsernameTaken(true);
                }
                if (response.data.errno === 4) {
                  setUsernameTaken(false);
                  let req = qs.stringify({
                    uid: createAccountId,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "capstone",
                    info: JSON.stringify({
                      user_name: username,
                      user_pwd: "na",
                      user_email: "na",
                      user_phone: "na",
                    }),
                  });
                  axios
                    .post("https://www.splitvision.top/api/capstone/query", req)
                    .then(async function (response) {
                      if (response.data.errno === 0) {
                        console.log(`Created ${username} | ${createAccountId}`);
                        setCreatingAccount(false);
                      }
                    });
                }
                setLoading(false);
              });
          }}
        />
      </View>
    );
  }
}

let config = {
  issuer: "https://accounts.google.com",
  scopes: ["email"],
  clientId:
    "460355842723-bsr9a76tc6i4d2k63km9q5db5hii80bm.apps.googleusercontent.com",
};

let StorageKey = "@RSVPme:GoogleOAuthKey";

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
  if (authState) {
    if (checkIfTokenExpired(authState)) {
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
  } catch (e) {
    alert(`Failed to revoke token: ${e.message}`);
  }
}

export async function requestSub() {
  var authState = await getCachedAuthAsync();
  if (authState) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${authState["accessToken"]}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => "google:".concat(JSON.parse(result)["sub"]))
      .catch((error) => console.log("error", error));
  }
  return null;
}

const styles = StyleSheet.create({
  headers: {
    textAlign: "center",
    fontSize: 40,
  },
});
