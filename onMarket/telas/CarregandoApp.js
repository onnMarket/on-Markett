import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import cores from './style/cores';

export default function CarregandoApp({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../image/onMarket_3.png')}
        style={{ width: 500, height: 500, marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
