// app/recipe/[id].tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { dummyRecipes } from '../../data/recipes';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  
  // Cari resep berdasarkan id yang dikirim dari halaman depan
  const recipe = dummyRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Resep tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.origin}>Asal: {recipe.origin}</Text>
      
      {/* Konten dummy untuk sementara karena di Modul 1 data kita belum ada bahan-bahannya */}
      <Text style={styles.sectionTitle}>Bahan-bahan:</Text>
      <Text style={styles.text}>- Bahan 1 (Akan diisi di Modul 3)</Text>
      <Text style={styles.text}>- Bahan 2</Text>

      <Text style={styles.sectionTitle}>Cara Membuat:</Text>
      <Text style={styles.text}>Cara membuat akan muncul di Modul 3.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  origin: { fontSize: 16, color: '#888', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#333' },
  text: { fontSize: 16, lineHeight: 24, color: '#444' },
});