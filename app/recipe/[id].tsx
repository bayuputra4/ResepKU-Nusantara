// app/recipe/[id].tsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Recipe } from '../../types/recipe';
import { fetchRecipeDetail } from '../../services/recipeService';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await fetchRecipeDetail(id as string);
        setRecipe(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#b91c1c" />;
  if (!recipe) return <Text style={{ padding: 20 }}>Resep tidak ditemukan.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.origin}>Asal: Indonesia</Text>
      
      <Text style={styles.sectionTitle}>Bahan-bahan:</Text>
      {recipe.ingredient?.map((item, index) => (
        <Text key={index} style={styles.text}>- {item}</Text>
      ))}

      <Text style={styles.sectionTitle}>Cara Membuat:</Text>
      {recipe.step?.map((step, index) => (
        <Text key={index} style={styles.text}>{step}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  origin: { fontSize: 14, color: '#888', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#333' },
  text: { fontSize: 16, lineHeight: 24, color: '#444', marginBottom: 4 },
});