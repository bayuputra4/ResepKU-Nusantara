// app/index.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { dummyRecipes } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>ResepKu Nusantara</Text>
      
      <FlatList
        data={dummyRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
});