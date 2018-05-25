import React from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    AsyncStorage,
    TouchableOpacity
} from "react-native";
import { List, ListItem, SearchBar, Icon } from "react-native-elements";
import { fetchMoviesInfo } from "../../utils/fetchMoviesInfo";
import TabNavigator from "react-native-tab-navigator";
import moment from "moment";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            favMovies: [],
            error: null,
            refreshing: false,
            selectedTab: "Movies"
        };
    }

    componentDidMount = async () => {
        const movieKeys = (await this.getKey()) || [];
        console.log({ movieKeys });
        this.setState({ favMovies: movieKeys });
        this.setState({ selectedTab: "Movies" });
        this.makeMoviesRequest();
    };

    endPointURL = query => {
        const url = "https://itunes.apple.com/search?";
        return query && query.length
            ? url + ("term=" + query + "&entity=movie")
            : url + "term=movie";
    };

    makeMoviesRequest = queryParam => {
        const url = this.endPointURL(queryParam);
        this.setState({ loading: true });
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: res.results,
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => {
            this.makeMoviesRequest();
        });
    };

    renderSeparator = () => {
        return <View style={styles.renderSeparator} />;
    };

    renderHeader = () => {
        return (
            <SearchBar
                round
                noIcon
                containerStyle={{ padding: 1 }}
                inputStyle={{ padding: 4, height: 50 }}
                onChangeText={queryParam => {
                    setTimeout(() => {
                        this.makeMoviesRequest(queryParam);
                    }, 500);
                }}
                onClear={queryParam => {
                    setTimeout(() => {
                        this.makeMoviesRequest(queryParam);
                    }, 500);
                }}
                placeholder=" Find you movie..."
            />
        );
    };

    getKey = async () => {
        try {
            const value = await AsyncStorage.getItem("FAVORITE_MOVIES");
            const favMovies = JSON.parse(value);
            return JSON.parse(value);
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
        return [];
    };

    setKey = async value => {
        try {
            const movieKeys = (await this.getKey()) || [];
            if (movieKeys.includes(value)) {
                const remaingKeys = movieKeys.filter(key => key !== value);
                console.log({ remaingKeys });
                const updatedValues = JSON.stringify([...new Set(remaingKeys)]);
                await AsyncStorage.setItem("FAVORITE_MOVIES", updatedValues);
                const prevFavMovies = (this.state.favMovies || []).filter(
                    key => key !== value
                );
                console.log({ prevFavMovies });
                this.setState({ favMovies: [...new Set(prevFavMovies)] });
                return;
            }
            movieKeys.push(value);
            const updatedValues = JSON.stringify([...new Set(movieKeys)]);
            await AsyncStorage.setItem("FAVORITE_MOVIES", updatedValues);
            const prevFavMovies = this.state.favMovies;
            const favMovies = [...prevFavMovies, value];
            this.setState({ favMovies: [...new Set(favMovies)] });
        } catch (error) {
            console.log("Error saving data" + error);
        }
    };

    renderFavIcon = item => {
        const { trackId } = item;
        const { favMovies = [] } = this.state;
        const isFavMovie = favMovies.includes(trackId);
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setKey(item.trackId);
                }}
            >
                <View style={styles.imageContainer}>
                    {isFavMovie ? (
                        <Icon name="favorite" color="red" />
                    ) : (
                        <Icon name="favorite-border" color="red" />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === "Movies"}
                    title="Movies"
                    titleStyle={styles.TabTitleStyle}
                    onPress={() => this.setState({ selectedTab: "Movies" })}
                >
                    <List
                        containerStyle={{
                            backgroundColor: "#fff"
                        }}
                    >
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.titleStyle}>
                                                {item.trackCensoredName}
                                            </Text>
                                            {this.renderFavIcon(item)};
                                        </View>
                                        <ListItem
                                            subtitle={
                                                <View>
                                                    <Text
                                                        style={
                                                            styles.ratingText
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.SubjectStyle
                                                            }
                                                        >
                                                            Director:
                                                        </Text>{" "}
                                                        {item.artistName}
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.ratingText
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.SubjectStyle
                                                            }
                                                        >
                                                            Year:
                                                        </Text>{" "}
                                                        {new moment(
                                                            item.releaseDate
                                                        ).format("MMM D, YYYY")}
                                                    </Text>

                                                    <Text
                                                        style={
                                                            styles.ratingText
                                                        }
                                                        numberOfLines={3}
                                                        ellipsizeMode={"tail"}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.SubjectStyle
                                                            }
                                                        >
                                                            Description:
                                                        </Text>{" "}
                                                        {item.shortDescription
                                                            ? item.shortDescription
                                                            : item.longDescription}
                                                    </Text>
                                                </View>
                                            }
                                            avatar={{ uri: item.artworkUrl100 }}
                                            avatarStyle={styles.avatarStyle}
                                            containerStyle={{
                                                borderBottomWidth: 0
                                            }}
                                            hideChevron
                                            onPress={target => {
                                                console.log({ target });
                                            }}
                                        />
                                    </View>
                                );
                            }}
                            keyExtractor={item =>
                                item.trackCensoredName + item.releaseDate
                            }
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={this.renderHeader}
                            onRefresh={this.handleRefresh}
                            refreshing={this.state.refreshing}
                            extraData={this.state.favMovies}
                            onEndReachedThreshold={50}
                        />
                    </List>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === "FavMovies"}
                    title="Favorites"
                    titleStyle={styles.TabTitleStyle}
                    onPress={() => {
                        this.setState({ selectedTab: "FavMovies" });
                    }}
                >
                    <View>
                        <Text>Hiiii</Text>
                    </View>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}

const styles = StyleSheet.create({
    renderSeparator: {
        height: 1,
        width: "100%",
        backgroundColor: "#CED0CE"
    },
    titleStyle: {
        padding: "2%",
        fontWeight: "700",
        fontSize: 20
    },
    titleContainer: {
        flexDirection: "row"
    },
    imageContainer: {
        paddingTop: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    ratingText: {
        paddingLeft: "15%",
        color: "black"
    },
    SubjectStyle: {
        fontWeight: "bold"
    },
    avatarStyle: {
        height: "235%",
        width: "235%"
    },
    TabTitleStyle: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: "700",
        margin: 5,
        paddingBottom: 8
    }
});
