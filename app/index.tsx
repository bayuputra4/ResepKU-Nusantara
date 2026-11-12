// app/index.tsx
import { View, FlatList, StyleSheet } from 'react-native';
import { dummyRecipes } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Tulisan Header manual dihapus karena udah ada dari _layout.tsx */}
      
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
    paddingTop: 16, // Dikurangi karena header udah ada dari Stack
    paddingHorizontal: 16,
  },
});