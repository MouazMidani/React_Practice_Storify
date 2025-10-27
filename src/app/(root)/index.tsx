import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Colors as stColors, util as stUtil } from "../../../Styleguide";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.heroText}>Storify - The only storage solution you need!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...stUtil.center,
    backgroundColor: stColors.platinum,
  },
  heroText: {
    color: stColors.primary,
    ...stUtil.h1
  }
});