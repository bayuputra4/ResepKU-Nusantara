// components/RecipeCard.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Recipe } from '../types/recipe';

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.origin}>{recipe.origin}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  origin: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});