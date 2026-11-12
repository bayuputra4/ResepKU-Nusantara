// app/index.tsx
import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { fetchRecipes } from '../services/recipeService';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe } from '../types/recipe';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        // Memanggil fungsi dari recipeService.ts
        // Di dalam sana sudah ada sistem "fallback" (data cadangan)
        // Jadi kalau API error, aplikasi nggak akan crash
        const data = await fetchRecipes();
        setRecipes(data);
        setError(null); 
      } catch (err: any) {
        setError('Terjadi kesalahan sistem saat memuat resep.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  // 1. Tampilan saat Loading (Muter-muter)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#b91c1c" />
        <Text style={styles.loadingText}>Memuat resep Nusantara...</Text>
      </View>
    );
  }

  // 2. Tampilan kalau Error total
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // 3. Tampilan Daftar Resep
  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// 4. Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  }
});