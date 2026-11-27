import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'modul4_demo_token';

export default function SecureStoreDemo() {
  const [value, setValue] = useState('');
  const [loaded, setLoaded] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    const cleanValue = value.trim();
    if (!cleanValue) {
      setStatus('Isi token demo sebelum menyimpan.');
      return;
    }
    setLoading(true);
    await SecureStore.setItemAsync(KEY, cleanValue);
    setValue('');
    setStatus('Token disimpan dengan SecureStore.');
    setLoading(false);
  };
  const load = async () => setLoaded((await SecureStore.getItemAsync(KEY)) ?? '');
  const remove = async () => {
    await SecureStore.deleteItemAsync(KEY);
    setLoaded('');
    setStatus('Token dihapus.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demo Penyimpanan Aman</Text>
      <TextInput style={styles.input} value={value} onChangeText={setValue} placeholder="Masukkan token demo" />
      <Pressable style={styles.button} onPress={save} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Simpan</Text>}
      </Pressable>
      <Pressable style={styles.button} onPress={load}><Text style={styles.text}>Muat</Text></Pressable>
      <Pressable style={[styles.button, styles.danger]} onPress={remove}><Text style={styles.text}>Hapus</Text></Pressable>
      {status ? <Text style={styles.status}>{status}</Text> : null}
      {loaded ? <Text style={styles.loaded}>Nilai: {loaded}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#b91c1c', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 },
  danger: { backgroundColor: '#7f1d1d' },
  text: { color: '#fff', fontWeight: '700' },
  status: { marginTop: 12, color: '#166534' },
  loaded: { marginTop: 8, color: '#333' },
});
