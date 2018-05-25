import Config from "react-native-config";

export const fetchMoviesInfo = async query => {
    const url = "https://itunes.apple.com/search?term=movie";
    const res = await fetch(url);
    return await res.json();
};
