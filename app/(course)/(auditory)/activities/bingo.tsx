import React, { useState, memo } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import BingoCard from '@/components/auditory/bingoCard';
import { FontAwesome6 } from "@expo/vector-icons";
import HeaderConfig from '@/components/HeaderConfig';
import { useRouter } from 'expo-router';

const Data = [
  { id: '1', image: require('@/assets/flashcards/apple.jpg'), word: 'bird' },
  { id: '2', image: require('@/assets/logo.png'), word: 'fence' },
  { id: '3', image: require('@/assets/flashcards/fireExtinguisher.jpg'), word: 'fence' },
  { id: '4', image: require('@/assets/flashcards/scissors.png'), word: 'bird' },
  { id: '5', image: require('@/assets/flashcards/teacher.jpg'), word: 'bird' },
  { id: '6', image: require('@/assets/dashImage/english.png'), word: 'fence' },
  { id: '7', image: require('@/assets/dashImage/math.png'), word: 'bird' },
  { id: '8', image: require('@/assets/dashImage/social.png'), word: 'bird' },
  { id: '9', image: require('@/assets/dashImage/speech.png'), word: 'fence' },
  { id: '10', image: require('@/assets/dashImage/speech.png'), word: 'fence' },
  { id: '11', image: require('@/assets/dashImage/speech.png'), word: 'fence' },
  { id: '12', image: require('@/assets/dashImage/speech.png'), word: 'fence' },

];


const bingo = () => {
  HeaderConfig("Bingo Cards")

  const [currentWord, setCurrentWord] = useState('bird');
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const router = useRouter();



interface Card {
    id: string;
    image: any;
    word: string;
}

const handleCardPress = (card: Card): void => {
    if (card.word === currentWord) {
        setMatchedIds([...matchedIds, card.id]);
    } 
};

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Easy</Text>
        

      {/* <Text>{currentWord}</Text> */}
      <FlatList
        data={Data}
        numColumns={3}
        renderItem={({ item }) => (
          <BingoCard
            image={item.image}
            isMatched={matchedIds.includes(item.id)}
            onPress={() => handleCardPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.speakerIcon}>
        <FontAwesome6 name="volume-high" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.listen}>Listen...</Text>
        
      <TouchableOpacity style={styles.done} onPress={()=> router.push("/(course)/(sub-details)/scoreDetails")}>
        <Text style={{fontSize:20, textAlign:"center", color:"#fff", fontWeight:"bold"}}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: 'center',
  },
  done: {
    margin:20,
    backgroundColor:"#ffbf18",
    width:"85%",
    padding:10,
    borderRadius:20,
  },
  speakerIcon: {
    backgroundColor: "#FFBF18",
    borderRadius: 180,
    alignSelf: "flex-start",
    height: 50,
    width: 50,
    top: 25,
    paddingTop:13,
    paddingLeft:10,
    left: 25,
    marginTop:-10,
    marginBottom: 20,
  },
  listen: {
    fontSize:18,
    top:-35,
    left: -75,
    color: "#ffbf18",
    marginBottom:-20,
  },
  header:{
    fontSize:20,
    fontWeight:"bold",
    left:-150,
    top:-30,
    marginBottom: -15,
  }
});

export default memo(bingo);
