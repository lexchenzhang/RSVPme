import React from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { globalStyles } from "../styles/global.js";
import { Formik } from "formik";
import * as yup from "yup";
import FlatButton from "../components/button";

const eventSchema = yup.object({
  event_title: yup.string().required().min(4),
  event_body: yup.string().required().min(8),
  event_address: yup.string().required().min(8),
  event_date: yup.string().required().min(8),
  event_rating: yup
    .string()
    .required()
    .test("is-num-1-5", "Rating must be a number 1 - 5", (val) => {
      return parseInt(val) < 6 && parseInt(val) > 0;
    }),
});

export default function EventForm({ addEvent: addEvent }) {
  return (
    <View style={globalStyles.container}>
      <Formik
        initialValues={{ event_title: "", event_body: "", event_rating: "1" }}
        validationSchema={eventSchema}
        onSubmit={(values, actions) => {
          actions.resetForm();
          addEvent(values);
        }}
      >
        {(props) => (
          <View>
            <TextInput
              style={globalStyles.input}
              placeholder="Event Title"
              onChangeText={props.handleChange("event_title")}
              value={props.values.event_title}
              onBlur={props.handleBlur("event_title")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.event_title && props.errors.event_title}
            </Text>

            <TextInput
              style={globalStyles.input}
              multiline
              placeholder="Event Details"
              onChangeText={props.handleChange("event_body")}
              value={props.values.event_body}
              onBlur={props.handleBlur("event_body")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.event_body && props.errors.event_body}
            </Text>

            <TextInput
              style={globalStyles.input}
              multiline
              placeholder="Event Address"
              onChangeText={props.handleChange("event_address")}
              value={props.values.event_address}
              onBlur={props.handleBlur("event_address")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.event_address && props.errors.event_address}
            </Text>

            <TextInput
              style={globalStyles.input}
              multiline
              placeholder="Event Date"
              onChangeText={props.handleChange("event_date")}
              value={props.values.event_date}
              onBlur={props.handleBlur("event_date")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.event_date && props.errors.event_date}
            </Text>

            <TextInput
              style={StyleSheet.create({height: 0})}
              placeholder="Rating (1 - 5)"
              onChangeText={props.handleChange("event_rating")}
              value={"1"}
              keyboardType="numeric"
              onBlur={props.handleBlur("event_rating")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.event_rating && props.errors.event_rating}
            </Text>

            <FlatButton text="submit" onPress={props.handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
}
