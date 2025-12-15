import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function BackButton({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 8 }}>
      <Ionicons name="arrow-back" size={24} color="#4f46e5" />
    </TouchableOpacity>
  );
}
