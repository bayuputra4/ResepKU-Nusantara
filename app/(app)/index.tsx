import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

type SavedRecipe = {
  id: number;
  title: string;
  notes: string;
  created_at: string;
};

export default function AppHome() {
  const { session, user, signOut } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState<SavedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSaved = useCallback(async () => {
    if (!supabase || !session?.user.id) return;
    setError(null);
    const { data, error: queryError } = await supabase
      .from('saved_recipes')
      .select('id,title,notes,created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (queryError) setError(queryError.message);
    else setRecipes((data ?? []) as SavedRecipe[]);
  }, [session]);

  useEffect(() => {
    let active = true;
    void (async () => {
      await fetchSaved();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [fetchSaved]);

  const saveRecipe = async () => {
    const cleanTitle = title.trim();
    const cleanNotes = notes.trim();
    if (!cleanTitle || !supabase || !user || saving) return;

    setSaving(true);
    setError(null);
    if (editing) {
      const previous = recipes;
      const updated = { ...editing, title: cleanTitle, notes: cleanNotes };
      setRecipes((items) => items.map((item) => item.id === editing.id ? updated : item));
      setEditing(null);
      const { error: updateError } = await supabase
        .from('saved_recipes')
        .update({ title: cleanTitle, notes: cleanNotes })
        .eq('id', editing.id)
        .eq('user_id', user.id);
      if (updateError) {
        setRecipes(previous);
        setError(updateError.message);
      }
    } else {
      const optimistic: SavedRecipe = {
        id: Date.now(),
        title: cleanTitle,
        notes: cleanNotes,
        created_at: new Date().toISOString(),
      };
      setRecipes((items) => [optimistic, ...items]);
      const { data, error: insertError } = await supabase
        .from('saved_recipes')
        .insert({ title: cleanTitle, notes: cleanNotes, user_id: user.id })
        .select('id,title,notes,created_at')
        .single();
      if (insertError) {
        setRecipes((items) => items.filter((item) => item.id !== optimistic.id));
        setError(insertError.message);
      } else if (data) {
        setRecipes((items) => items.map((item) => item.id === optimistic.id ? data as SavedRecipe : item));
      }
    }
    setTitle('');
    setNotes('');
    setSaving(false);
  };

  const deleteRecipe = async (recipe: SavedRecipe) => {
    if (!supabase || !user) return;
    const previous = recipes;
    setRecipes((items) => items.filter((item) => item.id !== recipe.id));
    const { error: deleteError } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('id', recipe.id)
      .eq('user_id', user.id);
    if (deleteError) {
      setRecipes(previous);
      setError(deleteError.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSaved();
    setRefreshing(false);
  };

  if (!isSupabaseConfigured) {
    return <View style={styles.center}><Text style={styles.error}>Supabase belum dikonfigurasi.</Text></View>;
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#b91c1c" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Resep Favorit</Text>
          <Text style={styles.email}>{session?.user.email}</Text>
        </View>
        <Pressable onPress={signOut}><Text style={styles.logout}>Keluar</Text></Pressable>
      </View>

      <Link href="/secure-store" asChild>
        <Pressable><Text style={styles.link}>Demo SecureStore</Text></Pressable>
      </Link>

      <TextInput
        style={styles.input}
        placeholder="Nama resep"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Catatan resep"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.primary} onPress={saveRecipe} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>{editing ? 'Simpan Perubahan' : 'Tambah Resep'}</Text>
        )}
      </Pressable>
      {editing && (
        <Pressable onPress={() => { setEditing(null); setTitle(''); setNotes(''); }}>
          <Text style={styles.cancel}>Batal edit</Text>
        </Pressable>
      )}

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Belum ada resep tersimpan.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {!!item.notes && <Text style={styles.cardNotes}>{item.notes}</Text>}
            <View style={styles.actions}>
              <Pressable onPress={() => { setEditing(item); setTitle(item.title); setNotes(item.notes); }}>
                <Text style={styles.action}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => deleteRecipe(item)}>
                <Text style={styles.delete}>Hapus</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16, paddingTop: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#333' },
  email: { color: '#777', marginTop: 2 },
  logout: { color: '#b91c1c', fontWeight: '700' },
  link: { color: '#2563eb', marginVertical: 8, fontWeight: '600' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 8 },
  notes: { minHeight: 64, textAlignVertical: 'top' },
  primary: { backgroundColor: '#b91c1c', borderRadius: 8, alignItems: 'center', padding: 12 },
  primaryText: { color: '#fff', fontWeight: '700' },
  cancel: { color: '#777', textAlign: 'center', marginTop: 8 },
  error: { color: '#b91c1c', marginBottom: 8 },
  list: { paddingTop: 12, paddingBottom: 30 },
  empty: { textAlign: 'center', color: '#777', marginTop: 24 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  cardNotes: { color: '#666', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 18, marginTop: 10 },
  action: { color: '#2563eb', fontWeight: '700' },
  delete: { color: '#b91c1c', fontWeight: '700' },
});
