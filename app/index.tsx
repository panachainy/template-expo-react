import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";

export default function Index() {
  const items = ["Magic", "Dragons", "Wizards", "Enchanted Forest"];

  const opacity1 = useSharedValue(0);
  const translateY1 = useSharedValue(50);
  const scale1 = useSharedValue(1);
  const opacity2 = useSharedValue(0);
  const translateY2 = useSharedValue(50);
  const scale2 = useSharedValue(1);
  const opacity3 = useSharedValue(0);
  const translateY3 = useSharedValue(50);
  const scale3 = useSharedValue(1);
  const opacity4 = useSharedValue(0);
  const translateY4 = useSharedValue(50);
  const scale4 = useSharedValue(1);

  const [animationKey, setAnimationKey] = useState(0);

  const startAnimation = useCallback(() => {
    opacity1.value = withDelay(0 * 200, withTiming(1, { duration: 500 }));
    translateY1.value = withDelay(0 * 200, withTiming(0, { duration: 500 }));
    opacity2.value = withDelay(1 * 200, withTiming(1, { duration: 500 }));
    translateY2.value = withDelay(1 * 200, withTiming(0, { duration: 500 }));
    opacity3.value = withDelay(2 * 200, withTiming(1, { duration: 500 }));
    translateY3.value = withDelay(2 * 200, withTiming(0, { duration: 500 }));
    opacity4.value = withDelay(3 * 200, withTiming(1, { duration: 500 }));
    translateY4.value = withDelay(3 * 200, withTiming(0, { duration: 500 }));
  }, [opacity1, opacity2, opacity3, opacity4, translateY1, translateY2, translateY3, translateY4]);

  useEffect(() => {
    startAnimation();
  }, [animationKey, startAnimation]);

  const handlePress = (index: number) => {
    const scales = [scale1, scale2, scale3, scale4];
    scales[index].value = withSpring(1.2, { damping: 10, stiffness: 100 });
    setTimeout(() => {
      scales[index].value = withSpring(1, { damping: 10, stiffness: 100 });
    }, 200);
  };

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }, { scale: scale1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: translateY2.value }, { scale: scale2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
    transform: [{ translateY: translateY3.value }, { scale: scale3.value }],
  }));

  const animatedStyle4 = useAnimatedStyle(() => ({
    opacity: opacity4.value,
    transform: [{ translateY: translateY4.value }, { scale: scale4.value }],
  }));

  const animatedStyles = [animatedStyle1, animatedStyle2, animatedStyle3, animatedStyle4];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      {items.map((item, index) => (
        <Pressable key={index} onPress={() => handlePress(index)}>
          <Animated.Text
            style={[
              {
                fontSize: 24,
                fontWeight: "bold",
                color: "#333",
                marginVertical: 10,
              },
              animatedStyles[index],
            ]}
          >
            {item}
          </Animated.Text>
        </Pressable>
      ))}
      <Pressable
        onPress={() => setAnimationKey(prev => prev + 1)}
        style={{
          marginTop: 40,
          padding: 10,
          backgroundColor: "#333",
          borderRadius: 5,
        }}
      >
        <Animated.Text style={{ color: "#fff", fontSize: 16 }}>Reset Animation</Animated.Text>
      </Pressable>
    </View>
  );
}
