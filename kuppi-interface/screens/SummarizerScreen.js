import React from "react";
import { View, Text, SafeAreaView } from "react-native";

const SummarizerScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Summarizer</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Enter or paste your text here..."
        />
      </View>
    </SafeAreaView>
  );
};

export default SummarizerScreen;
