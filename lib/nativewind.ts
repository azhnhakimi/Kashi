import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

cssInterop(Entypo, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

cssInterop(AntDesign, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});
