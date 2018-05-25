import React from "react";
import { StyleSheet, View } from "react-native";
import Tab from "../../components/Tab";

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.Container}>
                <Tab />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    }
});
