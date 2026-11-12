import { AsyncStorage } from "react-native";

const FAVORITES_KEY = "FAVORITE_MOVIES";
const ITUNES_SEARCH_URL = "https://itunes.apple.com/search?";

// --- Favorites (persisted locally with AsyncStorage) -----------------------

// Returns the list of favorite track ids, or [] if none / on error.
export const getKey = async () => {
    try {
        const value = await AsyncStorage.getItem(FAVORITES_KEY);
        return JSON.parse(value) || [];
    } catch (error) {
        console.log("Error retrieving favorites: " + error);
        return [];
    }
};

// Toggles a movie's favorite status, persists the new list, and returns it.
// Centralizes the add/remove logic so the UI doesn't have to duplicate it.
export const toggleFavorite = async trackId => {
    const current = await getKey();
    const next = current.includes(trackId)
        ? current.filter(id => id !== trackId)
        : [...current, trackId];
    const deduped = [...new Set(next)];
    try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(deduped));
    } catch (error) {
        console.log("Error saving favorites: " + error);
    }
    return deduped;
};

// --- iTunes search ---------------------------------------------------------

export const endPointURL = query =>
    query && query.length
        ? ITUNES_SEARCH_URL + "term=" + query + "&entity=movie"
        : ITUNES_SEARCH_URL + "term=movie";

export const makeMoviesRequest = async queryParam => {
    try {
        const res = await fetch(endPointURL(queryParam));
        const data = await res.json();
        return {
            data: data.results || [],
            error: data.error || null,
            refreshing: false
        };
    } catch (error) {
        return { data: [], error: String(error), refreshing: false };
    }
};
