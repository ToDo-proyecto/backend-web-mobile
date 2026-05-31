import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/services/auth/login';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Email o contraseña incorrectos',
  'auth/user-not-found': 'No existe una cuenta con ese email',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-email': 'El email no es válido',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
};

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(FIREBASE_ERRORS[err.code] ?? 'Error al iniciar sesión');
      } else {
        setError('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#151718' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 8 }}>
            <View style={{
              width: 60, height: 60, borderRadius: 18,
              backgroundColor: '#0a7ea4',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
              marginBottom: 16,
            }}>
              <MaterialIcons name="check-circle" size={30} color="white" />
            </View>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#ECEDEE', marginBottom: 4 }}>
              Welcome back
            </Text>
            <Text style={{ fontSize: 14, color: '#9BA1A6' }}>
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 8 }}>
                Email
              </Text>
              <View style={{
                backgroundColor: '#1E2122', borderWidth: 1, borderColor: '#2D3235',
                borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
              }}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#4A5258"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  style={{ color: '#ECEDEE', fontSize: 16 }}
                />
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 8 }}>
                Password
              </Text>
              <View style={{
                backgroundColor: '#1E2122', borderWidth: 1, borderColor: '#2D3235',
                borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                flexDirection: 'row', alignItems: 'center',
              }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#4A5258"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  style={{ color: '#ECEDEE', fontSize: 16, flex: 1 }}
                />
                <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color="#9BA1A6"
                  />
                </Pressable>
              </View>
            </View>

            {error && (
              <View style={{
                backgroundColor: '#EF444420', borderRadius: 10, borderWidth: 1,
                borderColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 10,
              }}>
                <Text style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: pressed || loading ? '#0868892' : '#0a7ea4',
                borderRadius: 18,
                paddingVertical: 18,
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center', gap: 10,
                marginTop: 8,
                // highlight border
                borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)',
                borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.25)',
                borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)',
                borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)',
                // glow
                shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 10 },
                shadowOpacity: pressed ? 0.2 : 0.55, shadowRadius: 20, elevation: 12,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              {loading ? (
                <Spinner size="small" color="white" />
              ) : (
                <>
                  <Text style={{ color: 'white', fontSize: 17, fontWeight: '800', letterSpacing: 0.4 }}>
                    Sign in
                  </Text>
                  <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MaterialIcons name="arrow-forward" size={16} color="white" />
                  </View>
                </>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
            <Text style={{ color: '#9BA1A6', fontSize: 14 }}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/register' as never)}>
              <Text style={{ color: '#0a7ea4', fontSize: 14, fontWeight: '700' }}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
