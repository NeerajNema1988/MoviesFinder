import { AsyncStorage } from "react-native";

export const fetchMoviesInfo = async query => {
    const url = "https://itunes.apple.com/search?term=movie";
    const res = await fetch(url);
    return await res.json();
};

export const getKey = async () => {
    try {
        const value = await AsyncStorage.getItem("FAVORITE_MOVIES");
        return JSON.parse(value);
    } catch (error) {
        console.log("Error retrieving data" + error);
    }
    return [];
};

export const setKey = async value => {
    try {
        const movieKeys = (await getKey()) || [];
        if (movieKeys.includes(value)) {
            const filteredKeys = movieKeys.filter(key => key !== value);
            const filteredKeysAsString = JSON.stringify([
                ...new Set(filteredKeys)
            ]);
            await AsyncStorage.setItem("FAVORITE_MOVIES", filteredKeysAsString);

            const prevFavMovies = (this.state.favMovies || []).filter(
                key => key !== value
            );
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

export const makeMoviesRequest = async queryParam => {
    const url = endPointURL(queryParam);
    const res = await fetch(url);
    const data = await res.json();
    return {
        data: data.results,
        error: data.error || null,
        refreshing: false
    };
};

export const endPointURL = query => {
    const url = "https://itunes.apple.com/search?";
    return query && query.length
        ? url + ("term=" + query + "&entity=movie")
        : url + "term=movie";
};
