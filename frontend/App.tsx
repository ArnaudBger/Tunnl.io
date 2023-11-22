import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Page from "./components/page";

export default function App() {
  return (
    <View style={styles.container}>
      <Page />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
