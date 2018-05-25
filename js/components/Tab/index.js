import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TabNavigator from "react-native-tab-navigator";
import ListView from "../../components/ListView";

export default class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedTab: "Movies" };
    }
    listViewMoviesRef = {};
    listViewFavoritesRef = {};
    render() {
        return (
            <View style={styles.Container}>
                <TabNavigator>
                    <TabNavigator.Item
                        title="Movies"
                        titleStyle={styles.TabTitleStyle}
                        selected={this.state.selectedTab === "Movies"}
                        selectedTitleStyle={styles.SelectedTabTitleStyle}
                        onPress={() => {
                            this.setState({ selectedTab: "Movies" });
                            this.listViewMoviesRef.componentDidMount();
                        }}
                    >
                        <ListView
                            ref={r => {
                                this.listViewMoviesRef = r;
                            }}
                        />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        title="Favorites"
                        titleStyle={styles.TabTitleStyle}
                        selected={this.state.selectedTab === "Favorites"}
                        selectedTitleStyle={styles.SelectedTabTitleStyle}
                        onPress={() => {
                            this.setState({ selectedTab: "Favorites" });
                            try {
                                setTimeout(() => {
                                    this.listViewFavoritesRef.componentDidMount();
                                }, 100);
                            } catch (ex) {
                                console.log({ ex });
                            }
                        }}
                    >
                        <ListView
                            displayFavorite={true}
                            ref={r => {
                                this.listViewFavoritesRef = r;
                            }}
                        />
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    },
    TabTitleStyle: {
        fontSize: 25,
        color: "gray",
        fontWeight: "600",
        margin: 5,
        paddingBottom: 8
    },
    SelectedTabTitleStyle: {
        fontSize: 25,
        color: "black",
        fontWeight: "700",
        margin: 5,
        paddingBottom: 8
    }
});
