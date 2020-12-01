import React, { useState, useEffect, useContext, useImperativeHandle } from "react";
import { View, StyleSheet, Text } from "react-native";
import axios from "axios";
const qs = require("qs");
import FriendCard from "../components/friendCard";
import FriendRCard from "../components/friendRCard";
import SearchAndButton from "../components/searchAndButton";
import { UserContext } from "../components/userContext";
import { globalStyles } from "../styles/global";

export default function Friends() {
  let [friends, setFriends] = useState([]);
  let [requests, setRequests] = useState([]);
  let [loadingF, setLoadingF] = useState(false);
  let [loadingR, setLoadingR] = useState(false);
  let [loadingC1, setLoadingC1] = useState(false);
  let [loadingC2, setLoadingC2] = useState(false);
  let [loadingC3, setLoadingC3] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    async function fetchFriends() {
      if(user.uid) {
        axios
        .post(
          "https://www.splitvision.top/api/capstone/getFriendList",
          qs.stringify({
            uid: user.uid,
            appid: "capstone",
            access_token: "test_token",
            sign: "capstone",
            info: null,
          })
        )
        .then(function (response) {
          if (response.data.errno === 0) {
            response.data.list.map((e) => {
              e.key = e._ctime;
            });
            setFriends(response.data.list);
            setLoadingF(false);
          } else if (response.data.errno === 4) {
            setFriends([]);
            setLoadingF(false);
          }
        }).catch((error) => {console.log(`axios ${error}`)});
      } else {
        setFriends([]);
        setLoadingF(false);
      }
    }

    async function fetchRequests() {
      if(user.uid) {
        axios
        .post(
          "https://www.splitvision.top/api/capstone/getRequests",
          qs.stringify({
            uid: user.uid,
            appid: "capstone",
            access_token: "test_token",
            sign: "capstone",
            info: null,
          })
        )
        .then(function (response) {
          if (response.data.errno === 0) {
            response.data.list.map((e) => {
              e.key = e._ctime;
            });
            setRequests(response.data.list);
            setLoadingR(false);
          } else {
            setRequests([]);
            setLoadingR(false)
          }
        }).catch((error) => {console.log(`axios ${error}`)});
      } else {
        setRequests([]);
        setLoadingR(false);
      }
    }

    setLoadingF(true);
    setLoadingR(true);

    const intervalId = setInterval(() => {
      fetchFriends();
      fetchRequests();
    }, 1000)
  }, [])

  if(loadingF || loadingR || loadingC1 || loadingC2 || loadingC3) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.headers}>Loading</Text>
      </View>
    );
  } else {
    return (
      <View style={globalStyles.container}>
        <SearchAndButton placeholder="Add User" materialIcon="person-add" onSearch={text => {
          //Make sure the user isn't already added or in requests
          let friendAdded = false;
          friends.map((f, i) => {
            if(text === f.user_name) {
              console.log(`Friend ${text} is already added!`)
              friendAdded = true;
            }
          })
          //Get the username to not add themselves
          if(!friendAdded) {
            axios
              .post(
                "https://www.splitvision.top/api/capstone/isUserExistByUID",
                qs.stringify({
                  uid: user.uid,
                  appid: "capstone",
                  access_token: "test_token",
                  sign: "signature",
                  info: JSON.stringify({
                    user_uid: user.uid,
                  })
                })
              )
              .then(function (response) {
                if(response.data.errno === 0){
                  const username = response.data.info.user_name;
                  if(text != username) {
                    // Find the user they are searching for
                    axios
                      .post(
                        "https://www.splitvision.top/api/capstone/getUserByName",
                        qs.stringify({
                          uid: user.uid,
                          appid: "capstone",
                          access_token: "test_token",
                          sign: "signature",
                          info: JSON.stringify({
                            user_name: text,
                          })
                        })
                      )
                      .then(function (response) {
                        if(response.data.errno === 0) {
                          const friendUID = response.data.info.uid;
                          // Make sure request isn't already sent
                          axios
                            .post(
                              "https://www.splitvision.top/api/capstone/getRequests",
                              qs.stringify({
                                uid: friendUID,
                                appid: "capstone",
                                access_token: "test_token",
                                sign: "signature",
                                info: null
                              })
                            )
                            .then(function (response) {
                              // Send request
                              let requestSent = false;
                              if(response.data.errno === 0) {
                                response.data.list.map((r, i) => {
                                  if(r.user_name === username) {
                                    console.log(`Request ${text} has already been sent!`)
                                    requestSent = true;
                                  }
                                })
                              }
                              if(!requestSent) {
                                axios
                                  .post(
                                    "https://www.splitvision.top/api/capstone/sendRequest",
                                    qs.stringify({
                                      uid: user.uid,
                                      appid: "capstone",
                                      access_token: "test_token",
                                      sign: "signature",
                                      info: JSON.stringify({
                                        target_uid: friendUID,
                                        user_name: username,
                                        user_message: ""
                                      })
                                    })
                                  )
                                  .catch((error) => {console.log(`axios ${error}`)});
                              }
                            })
                            .catch((error) => {console.log(`axios ${error}`)});
                        }
                      })
                      .catch((error) => {console.log(`axios ${error}`)});
                  }
                }
              })
              .catch((error) => {console.log(`axios ${error}`)});
          }
        }} />
        <Text style={styles.headers}>Friends</Text>
        {
          friends.map((value, index) => {
            return <FriendCard username={value.user_name} removeIcon="clear" onRemove={() => {
              setLoadingC1(true);
              setLoadingC2(true);
              axios
                .post(
                  "https://www.splitvision.top/api/capstone/remFriend",
                  qs.stringify({
                    uid: user.uid,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "signature",
                    info: JSON.stringify({
                      fid: value.fid,
                    })
                  })
                ).then(() => setLoadingC1(false))
                .catch((error) => {console.log(`axios ${error}`)});
              axios
                .post(
                  "https://www.splitvision.top/api/capstone/remFriend",
                  qs.stringify({
                    uid: value.fid,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "signature",
                    info: JSON.stringify({
                      fid: user.uid,
                    })
                  })
                ).then(() => setLoadingC2(false))
                .catch((error) => {console.log(`axios ${error}`)});
                setLoadingF(true);
            }} key={index}/>
          })
        }
        <Text style={styles.headers}>Requests</Text>
        {
          requests.map((value, index) => {
            return <FriendRCard username={value.user_name} onAccept={() => {       
              setLoadingC1(true);     
              setLoadingC2(true);     
              setLoadingC3(true);     
              axios
                .post(
                  "https://www.splitvision.top/api/capstone/addFriend",
                  qs.stringify({
                    uid: user.uid,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "signature",
                    info: JSON.stringify({
                      fid: value.uid,
                    })
                  })
                ).then(() => setLoadingC1(false))
                .catch((error) => {console.log(`axios ${error}`)});

              axios
                .post(
                  "https://www.splitvision.top/api/capstone/addFriend",
                  qs.stringify({
                    uid: value.uid,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "signature",
                    info: JSON.stringify({
                      fid: user.uid,
                    })
                  })
                ).then(() => setLoadingC2(false))
                .catch((error) => {console.log(`axios ${error}`)});

                axios
                .post(
                  "https://www.splitvision.top/api/capstone/declineRequest",
                  qs.stringify({
                    uid: user.uid,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "signature",
                    info: JSON.stringify({
                      req_uid: value.uid,
                    })
                  })
                ).then(() => setLoadingC3(false))
                .catch((error) => {console.log(`axios ${error}`)});
                setLoadingR(true);
            }} onDecline={() => {
              setLoadingC1(true);
              axios
                .post(
                  "https://www.splitvision.top/api/capstone/declineRequest",
                  qs.stringify({
                    uid: user.uid,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "signature",
                    info: JSON.stringify({
                      req_uid: value.uid,
                    })
                  })
                ).then(() => setLoadingC1(false))
                .catch((error) => {console.log(`axios ${error}`)});
                setLoadingR(true);
            }} key={index}/>
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headers: {
    textAlign: "center",
    fontSize: 40
  }
})