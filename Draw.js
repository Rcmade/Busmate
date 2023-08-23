import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';

const DrawerExample = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const animation = new Animated.Value(0);

  const toggleDrawer = () => {
    const toValue = drawerOpen ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setDrawerOpen(!drawerOpen);
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Adjust the value as per your drawer width
  });

  console.log({translateX});

  return (
    <View style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.hamburger}>
          <Text>☰</Text>
          {/* Hamburger Button */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Header</Text>
      </View>

      <View style={{flex: 1}}>
        {/* Your main content goes here */}
        <Text>Main Content</Text>
      </View>
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            transform: [{translateX}],
          },
        ]}>
        {/* Drawer content goes here */}
        <Text>Drawer Content</Text>
        <Text>Drawer Content</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
    backgroundColor: 'lightgray',
  },
  hamburger: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300, // Adjust the width of the drawer
    height: '100%',
    backgroundColor: 'white',
  },
});

export default DrawerExample;
