import { createContext, useCallback, useRef } from "react";
import { Animated } from "react-native";

type SkeletonContextType = {
  shimmer: Animated.Value;
  register: () => void;
  unregister: () => void;
};

export const SkeletonContext = createContext<SkeletonContextType | null>(null);

type SkeletonProviderProps = {
  children: React.ReactNode;
};

const SkeletonProvider = ({ children }: SkeletonProviderProps) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const subscriberCount = useRef(0);

  const register = useCallback(() => {
    subscriberCount.current += 1;

    if (subscriberCount.current === 1) {
      shimmer.setValue(0);

      animation.current = Animated.loop(
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          isInteraction: false,
        }),
      );

      animation.current.start();
    }
  }, [shimmer]);

  const unregister = useCallback(() => {
    subscriberCount.current = Math.max(0, subscriberCount.current - 1);

    if (subscriberCount.current === 0) {
      animation.current?.stop();
      animation.current = null;
    }
  }, []);

  return (
    <SkeletonContext.Provider value={{ shimmer, register, unregister }}>
      {children}
    </SkeletonContext.Provider>
  );
};

export default SkeletonProvider;