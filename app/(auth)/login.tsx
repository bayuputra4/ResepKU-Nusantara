import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    const cleanEmail = email.trim();
    const cleanCallsign = callsign.trim();

    if (!cleanEmail || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (signingUp && !cleanCallsign) {
      setError('Nama panggilan wajib diisi untuk daftar.');
      return;
    }

    setLoading(true);
    setError(null);
    const result = signingUp
      ? await signUp(cleanEmail, password, cleanCallsign)
      : await signIn(cleanEmail, password);
    setLoading(false);

    if (result.error) setError(result.error.message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ResepKu Nusantara</Text>
      <Text style={styles.subtitle}>{signingUp ? 'Daftar akun baru' : 'Masuk ke akun'}</Text>

      {signingUp && (
        <TextInput
          style={styles.input}
          placeholder="Nama panggilan"
          value={callsign}
          onChangeText={setCallsign}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.primary} onPress={handleAuth} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>{signingUp ? 'Daftar' : 'Masuk'}</Text>
        )}
      </Pressable>
      <Pressable onPress={() => { setSigningUp((value) => !value); setError(null); }} disabled={loading}>
        <Text style={styles.switchText}>
          {signingUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: '800', color: '#b91c1c', textAlign: 'center' },
  subtitle: { marginBottom: 24, marginTop: 8, textAlign: 'center', color: '#666' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 12 },
  error: { color: '#b91c1c', marginBottom: 12 },
  primary: { backgroundColor: '#b91c1c', padding: 14, borderRadius: 10, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  switchText: { color: '#b91c1c', textAlign: 'center', marginTop: 16, fontWeight: '600' },
});
