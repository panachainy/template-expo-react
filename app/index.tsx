import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

export default function Index() {
  const items = ["Magic", "Dragons", "Wizards", "Enchanted Forest"];

  const opacity1 = useSharedValue(0);
  const translateY1 = useSharedValue(50);
  const opacity2 = useSharedValue(0);
  const translateY2 = useSharedValue(50);
  const opacity3 = useSharedValue(0);
  const translateY3 = useSharedValue(50);
  const opacity4 = useSharedValue(0);
  const translateY4 = useSharedValue(50);

  useEffect(() => {
    opacity1.value = withDelay(0 * 200, withTiming(1, { duration: 500 }));
    translateY1.value = withDelay(0 * 200, withTiming(0, { duration: 500 }));
    opacity2.value = withDelay(1 * 200, withTiming(1, { duration: 500 }));
    translateY2.value = withDelay(1 * 200, withTiming(0, { duration: 500 }));
    opacity3.value = withDelay(2 * 200, withTiming(1, { duration: 500 }));
    translateY3.value = withDelay(2 * 200, withTiming(0, { duration: 500 }));
    opacity4.value = withDelay(3 * 200, withTiming(1, { duration: 500 }));
    translateY4.value = withDelay(3 * 200, withTiming(0, { duration: 500 }));
  }, [opacity1, opacity2, opacity3, opacity4, translateY1, translateY2, translateY3, translateY4]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: translateY2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
    transform: [{ translateY: translateY3.value }],
  }));

  const animatedStyle4 = useAnimatedStyle(() => ({
    opacity: opacity4.value,
    transform: [{ translateY: translateY4.value }],
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
        <Animated.Text
          key={index}
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
      ))}
    </View>
  );
}
