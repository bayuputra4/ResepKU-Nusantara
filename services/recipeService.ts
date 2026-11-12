// services/recipeService.ts
import { Recipe } from '../types/recipe';

// DATA CADANGAN (Jaga-jaga kalau API TheMealDB ngambek/error)
const fallbackRecipes: Recipe[] = [
  {
    key: '1',
    title: 'Beef Rendang',
    thumb: 'https://www.themealdb.com/images/media/meals/4y4y4y1511204398.jpg',
    difficulty: 'Sulit',
    times: '2 Jam',
    ingredient: ['Daging Sapi', 'Santan', 'Cabai', 'Rempah-rempah'],
    step: ['Haluskan bumbu', 'Masak daging dengan santan', 'Masak hingga empuk dan kuah menyusut']
  },
  {
    key: '2',
    title: 'Nasi Goreng',
    thumb: 'https://www.themealdb.com/images/media/meals/1529444664.jpg',
    difficulty: 'Mudah',
    times: '15 Menit',
    ingredient: ['Nasi', 'Telur', 'Kecap Manis', 'Bawang Merah'],
    step: ['Tumis bawang', 'Masukkan telur dan nasi', 'Tambahkan kecap, aduk rata']
  },
  {
    key: '3',
    title: 'Sate Ayam',
    thumb: 'https://www.themealdb.com/images/media/meals/1529444664.jpg',
    difficulty: 'Sedang',
    times: '45 Menit',
    ingredient: ['Ayam', 'Kacang', 'Kecap'],
    step: ['Potong ayam', 'Tusuk', 'Bakar', 'Siram bumbu kacang']
  }
];

export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=Indonesian');
    if (!response.ok) throw new Error('Gagal koneksi ke server');
    
    const data = await response.json();
    
    // Kalau API balikin data kosong, pakai data cadangan
    if (!data.meals || data.meals.length === 0) {
      console.log("API Kosong, menggunakan data cadangan.");
      return fallbackRecipes;
    }

    return data.meals.map((item: any) => ({
      key: item.idMeal,
      title: item.strMeal,
      thumb: item.strMealThumb,
      difficulty: 'Mudah',
      times: '-',
      ingredient: [],
      step: []
    }));
  } catch (error) {
    // Kalau internet mati atau API error, pakai data cadangan
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
      // Kalau detail dari API kosong, cari di data cadangan
      const fallback = fallbackRecipes.find(r => r.key === id);
      if (fallback) return fallback;
      throw new Error('Data tidak ditemukan');
    }

    const meal = data.meals[0];
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
      difficulty: 'Mudah',
      times: '-',
      ingredient: ingredients,
      step: meal.strInstructions.split('\r\n').filter((s: string) => s.trim() !== ''),
    };
  } catch (error) {
    // Kalau detail API error, ambil dari cadangan
    const fallback = fallbackRecipes.find(r => r.key === id);
    if (fallback) return fallback;
    throw error;
  }
}