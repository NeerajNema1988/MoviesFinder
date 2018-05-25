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
import * as helper from "../../utils/helper";
import moment from "moment";

export default class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            favMovies: [],
            error: null,
            refreshing: false
        };
    }

    componentDidMount = async () => {
        const movieKeys = (await helper.getKey()) || [];
        this.setState({
            favMovies: movieKeys
        });
        this.makeMoviesRequest();
    };

    handleRefresh = async () => {
        this.setState({ refreshing: true }, async () => {
            await this.makeMoviesRequest();
        });
    };

    makeMoviesRequest = async queryParam => {
        const res = await helper.makeMoviesRequest(queryParam);
        this.setState({
            data: res.data,
            error: res.error || null,
            refreshing: res.refreshing
        });
    };

    renderSeparator = () => {
        return <View style={styles.renderSeparator} />;
    };

    renderHeader = () => {
        return (
            <SearchBar
                placeholder=" Find you movie..."
                containerStyle={{ padding: 1 }}
                inputStyle={{ padding: 4, height: 50 }}
                onChangeText={queryParam => {
                    this.makeMoviesRequest(queryParam);
                }}
                onClear={queryParam => {
                    this.makeMoviesRequest(queryParam);
                }}
                noIcon
            />
        );
    };

    renderFavoriteIcon = item => {
        const { favMovies = [] } = this.state;
        const isFavMovie = favMovies.includes(item.trackId);
        return (
            <TouchableOpacity
                onPress={async () => {
                    const value = item.trackId;
                    const movieKeys = (await helper.getKey()) || [];
                    if (movieKeys.includes(value)) {
                        const filteredKeys = movieKeys.filter(
                            key => key !== value
                        );
                        const filteredKeysAsString = JSON.stringify([
                            ...new Set(filteredKeys)
                        ]);
                        await AsyncStorage.setItem(
                            "FAVORITE_MOVIES",
                            filteredKeysAsString
                        );
                        const prevFavMovies = (
                            this.state.favMovies || []
                        ).filter(key => key !== value);
                        this.setState({
                            favMovies: [...new Set(prevFavMovies)]
                        });
                        return;
                    }
                    movieKeys.push(value);
                    const updatedValues = JSON.stringify([
                        ...new Set(movieKeys)
                    ]);
                    await AsyncStorage.setItem(
                        "FAVORITE_MOVIES",
                        updatedValues
                    );
                    const prevFavMovies = this.state.favMovies;
                    const favMovies = [...prevFavMovies, value];
                    this.setState({ favMovies: [...new Set(favMovies)] });
                    // helper.setKey(item.trackId);
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

    renderListItemSubTitle = item => {
        return (
            <View>
                <Text style={styles.subTitleStyle}>
                    <Text style={styles.SubjectStyle}>Director:</Text>{" "}
                    {item.artistName}
                </Text>
                <Text style={styles.subTitleStyle}>
                    <Text style={styles.SubjectStyle}>Year:</Text>{" "}
                    {new moment(item.releaseDate).format("MMM D, YYYY")}
                </Text>

                <Text
                    style={styles.subTitleStyle}
                    numberOfLines={3}
                    ellipsizeMode={"tail"}
                >
                    <Text style={styles.SubjectStyle}>Description:</Text>{" "}
                    {item.shortDescription
                        ? item.shortDescription
                        : item.longDescription}
                </Text>
            </View>
        );
    };

    renderListItem = item => {
        return (
            <View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleStyle}>
                        {item.trackCensoredName}
                    </Text>
                    {this.renderFavoriteIcon(item)};
                </View>
                <ListItem
                    subtitle={this.renderListItemSubTitle(item)}
                    avatar={{
                        uri: item.artworkUrl100
                    }}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    hideChevron
                />
            </View>
        );
    };

    render() {
        const { displayFavorite } = this.props;
        let data = this.state.data;
        if (displayFavorite) {
            data = (this.state.data || []).filter(curr =>
                this.state.favMovies.includes(curr.trackId)
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <List>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => {
                            return this.renderListItem(item);
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    },
    renderSeparator: {
        height: 1,
        backgroundColor: "#CED0CE"
    },
    titleStyle: {
        paddingLeft: 8,
        paddingTop: 8,
        paddingBottom: 4,
        paddingRight: 12,
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
    subTitleStyle: {
        paddingLeft: 45,
        color: "black"
    },
    SubjectStyle: {
        fontWeight: "bold"
    },
    avatarStyle: {
        height: 80,
        width: 80
    }
});
