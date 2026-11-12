<div align="center">

# 🎬 MoviesFinder

### A React Native app to search movies via the iTunes API and save your favorites — built as a self-study project to explore mobile development.

[![React Native](https://img.shields.io/badge/React_Native-0.5x-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)](#)
[![Learning Project](https://img.shields.io/badge/Type-Self--study-8A2BE2)](#)

</div>

---

> 📚 **About this project**
> MoviesFinder is a hands-on learning project I built to get comfortable with **React Native** — component structure, list rendering, local persistence, and consuming a public REST API. It isn't a production app; it's a focused playground for the core patterns of a real mobile app.

## ✨ Features

- 🔎 **Search movies** by title or artist using the public **iTunes Search API**
- 🎞️ **Rich results** — poster, director, release year, and a short description for each movie
- ❤️ **Favorites** — tap the heart to save a movie; favorites persist on-device via `AsyncStorage`
- 🗂️ **Two tabs** — *Movies* (all search results) and *Favorites* (just your saved ones)
- 🔄 **Pull-to-refresh** on the list

## 🧰 Tech Stack

| Area | Technology |
|---|---|
| Framework | React Native |
| UI | `react-native-elements`, `react-native-vector-icons`, `react-native-tab-navigator` |
| Dates | `moment` |
| Storage | `AsyncStorage` (local, on-device) |
| Data | [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) |

## 🗂️ Project Structure

```
js/
├── containers/
│   └── App/           # root component
├── components/
│   ├── Tab/           # Movies / Favorites tab navigator
│   └── ListView/      # search bar + movie list + favorite toggle
└── utils/
    └── helper.js      # iTunes API calls + favorites persistence
```

## 🚀 Getting Started

> Requires a working [React Native environment](https://reactnative.dev/docs/environment-setup) (Node, Watchman, Xcode and/or Android Studio).

```bash
# install dependencies
npm install

# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 📝 What I learned

- Structuring a React Native app into containers, components, and helpers
- Rendering performant lists with `FlatList` (separators, headers, pull-to-refresh)
- Persisting simple state locally with `AsyncStorage`
- Consuming and shaping a public REST API inside a mobile UI

---

<sub>Self-study project · not intended for production use.</sub>
