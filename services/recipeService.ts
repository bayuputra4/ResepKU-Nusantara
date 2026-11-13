// services/recipeService.ts
import { Recipe } from '../types/recipe';

// Data cadangan kalau internet mati
const fallbackRecipes: Recipe[] = [
  { key: '1', title: 'Fallback Resep (Mode Offline)', thumb: '', difficulty: 'Sulit', times: '2 Jam', ingredient: ['Bahan'], step: ['Langkah'] }
];

export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    // API TheMealDB (Live API)
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
    
    if (!response.ok) throw new Error('Gagal koneksi ke server');
    
    const data = await response.json();
    
    if (!data.meals) {
      throw new Error('Data tidak ditemukan di API');
    }

    return data.meals.map((item: any) => ({
      key: item.idMeal,
      title: item.strMeal,
      thumb: item.strMealThumb,
      difficulty: item.strCategory || 'Mudah', // Ambil kategori sebagai difficulty
      times: item.strArea || 'Waktu tidak diketahui', // Ambil area asal
      ingredient: [],
      step: []
    }));
  } catch (error) {
    console.log("Error API, menggunakan data cadangan.");
    return fallbackRecipes; 
  }
}

export async function fetchRecipeDetail(id: string): Promise<Recipe> {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (!response.ok) throw new Error('Gagal koneksi detail');
    
    const data = await response.json();
    
    if (!data.meals) {
      throw new Error('Detail tidak ditemukan');
    }

    const meal = data.meals[0];
    
    // Ekstrak bahan-bahan
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(ingredient);
      }
    }

    return {
      key: meal.idMeal,
      title: meal.strMeal,
      thumb: meal.strMealThumb,
      difficulty: meal.strCategory || 'Mudah',
      times: meal.strArea || 'Waktu tidak diketahui',
      ingredient: ingredients,
      step: meal.strInstructions.split('\r\n').filter((s: string) => s.trim() !== ''),
    };
  } catch (error) {
    const fallback = fallbackRecipes.find(r => r.key === id);
    if (fallback) return fallback;
    throw error;
  }
}

// Fungsi untuk kriteria .then(), resolve(), reject()
export function cekKoneksiServer(): Promise<string> {
  return new Promise((resolve, reject) => {
    const isServerOnline = true;
    setTimeout(() => {
      if (isServerOnline) {
        resolve("Server Online");
      } else {
        reject("Server Offline");
      }
    }, 1000);
  });
}

export function demoThenCatch() {
  cekKoneksiServer()
    .then((hasil) => { console.log("Status:", hasil); })
    .catch((error) => { console.log("Error:", error); });
}