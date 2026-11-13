// components/RecipeCard.tsx
import { Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Recipe } from '../types/recipe';

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <Link href={`/recipe/${recipe.key}`} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.origin}>
          Kategori: {recipe.difficulty} | Asal: {recipe.times}
        </Text>
      </Pressable>
    </Link>
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