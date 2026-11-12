// components/RecipeCard.tsx
import { Text, StyleSheet, Pressable } from 'react-native'; // Ganti View jadi Pressable
import { Link } from 'expo-router';
import { Recipe } from '../types/recipe';

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <Link href={`/recipe/${recipe.id}`} asChild>
      {/* Pakai Pressable biar bisa diklik */}
      <Pressable style={styles.card}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.origin}>{recipe.origin}</Text>
      </Pressable>
    </Link>
  );
}

// ... (biarkan styles tetap sama seperti sebelumnya)
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