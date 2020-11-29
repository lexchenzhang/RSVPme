import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import FlatButton from "../components/button";
import FriendCard from "../components/friendCard";
import FriendRCard from "../components/friendRCard";
import SearchAndButton from "../components/searchAndButton";
import { globalStyles } from "../styles/global";

export default function Friends() {
  let [friends, setFriends] = useState([{username: "Tyler"}, {username: "Caleb"}]);
  let [requests, setRequests] = useState([{username: "Lex"}]);

  return (
    <View style={globalStyles.container}>
      <SearchAndButton placeholder="Add User" materialIcon="person-add" onSearch={text => {console.log("Searching " + text); setFriends([...friends, {username: text}])}} />
      <Text style={styles.headers}>Friends</Text>
      {
        friends.map((value, index) => {
          return <FriendCard username={value.username} onRemove={() => {console.log("Removing " + value.username)}} key={index}/>
        })
      }
      <Text style={styles.headers}>Requests</Text>
      {
        requests.map((value, index) => {
          return <FriendRCard username={value.username} onAccept={() => {console.log("Accepting " + value.username)}} onDecline={() => {console.log("Declining " + value.username)}} key={index}/>
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  headers: {
    textAlign: "center",
    fontSize: 40
  }
})