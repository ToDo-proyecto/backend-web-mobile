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
import { register } from '@/services/auth/register';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email',
  'auth/invalid-email': 'El email no es válido',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
};

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError('Completa todos los campos');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(FIREBASE_ERRORS[err.code] ?? 'Error al crear la cuenta');
      } else {
        setError('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label, value, onChange, placeholder, secure, keyboard, returnKey, onSubmit,
  }: any) => (
    <View>
      <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{
        backgroundColor: '#1E2122', borderWidth: 1, borderColor: '#2D3235',
        borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
        flexDirection: 'row', alignItems: 'center',
      }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#4A5258"
          secureTextEntry={secure && !showPassword}
          keyboardType={keyboard ?? 'default'}
          autoCapitalize={keyboard === 'email-address' ? 'none' : label === 'Name' ? 'words' : 'none'}
          autoCorrect={false}
          returnKeyType={returnKey ?? 'next'}
          onSubmitEditing={onSubmit}
          style={{ color: '#ECEDEE', fontSize: 16, flex: 1 }}
        />
        {secure && (
          <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color="#9BA1A6"
            />
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#151718' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 32 }}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color="#9BA1A6" />
            <Text style={{ color: '#9BA1A6', fontSize: 15 }}>Sign in</Text>
          </Pressable>

          {/* Header */}
          <View style={{ marginBottom: 36 }}>
            <Text style={{ fontSize: 30, fontWeight: '700', color: '#ECEDEE', marginBottom: 6 }}>
              Create account
            </Text>
            <Text style={{ fontSize: 15, color: '#9BA1A6' }}>
              Start managing your tasks today
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" keyboard="email-address" />
            <Field label="Password" value={password} onChange={setPassword} placeholder="Min. 6 characters" secure />
            <Field label="Confirm password" value={confirm} onChange={setConfirm} placeholder="Repeat your password" secure returnKey="done" onSubmit={handleRegister} />

            {error && (
              <View style={{
                backgroundColor: '#EF444420', borderRadius: 10, borderWidth: 1,
                borderColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 10,
              }}>
                <Text style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: '#0a7ea4', borderRadius: 14,
                paddingVertical: 16, alignItems: 'center', marginTop: 4,
                opacity: pressed || loading ? 0.8 : 1,
                shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
              })}
            >
              {loading
                ? <Spinner size="small" color="white" />
                : <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Create account</Text>
              }
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
