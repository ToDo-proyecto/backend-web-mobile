import React, { useState } from 'react';
import {
  Modal, View, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
  TouchableWithoutFeedback, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { createTaskList } from '@/services/tasks/taskLists';
import { TaskList } from '@/types/TaskList';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#F97316'];
const ICONS: { name: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { name: 'code', label: 'Code' },
  { name: 'menu-book', label: 'Book' },
  { name: 'functions', label: 'Math' },
  { name: 'person', label: 'Personal' },
  { name: 'work', label: 'Work' },
  { name: 'fitness-center', label: 'Fitness' },
  { name: 'shopping-cart', label: 'Shop' },
  { name: 'favorite', label: 'Fav' },
  { name: 'star', label: 'Star' },
  { name: 'home', label: 'Home' },
  { name: 'school', label: 'School' },
  { name: 'sports-esports', label: 'Games' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: (list: TaskList) => void;
};

export default function CreateListSheet({ visible, onClose, onCreated }: Props) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState<keyof typeof MaterialIcons.glyphMap>('code');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setTitle(''); setSubtitle(''); setTags('');
    setColor(COLORS[0]); setIcon('code'); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleCreate = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setError('');
    setLoading(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      const list = await createTaskList({
        title: title.trim(), subtitle: subtitle.trim(),
        tags: tagList, idColor: color, idIcon: icon,
      });
      onCreated(list);
      reset();
    } catch {
      setError('Could not create list. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={{
                backgroundColor: '#1A1C1E',
                borderTopLeftRadius: 28, borderTopRightRadius: 28,
                paddingTop: 12, paddingHorizontal: 24,
                paddingBottom: Math.max(insets.bottom, 16) + 16,
                maxHeight: '90%',
              }}>
                {/* Handle */}
                <View style={{ width: 36, height: 4, backgroundColor: '#3A3D40', borderRadius: 99, alignSelf: 'center', marginBottom: 24 }} />

                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#ECEDEE' }}>New List</Text>
                  <Pressable onPress={handleClose} hitSlop={8}>
                    <MaterialIcons name="close" size={22} color="#9BA1A6" />
                  </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  <InputField label="Title *" value={title} onChange={setTitle} placeholder="e.g. Study Notes" autoFocus />
                  <InputField label="Description" value={subtitle} onChange={setSubtitle} placeholder="Optional" />
                  <InputField label="Tags (comma separated)" value={tags} onChange={setTags} placeholder="school, important" />

                  {/* Color */}
                  <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 12 }}>Color</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                    {COLORS.map(c => (
                      <Pressable
                        key={c}
                        onPress={() => setColor(c)}
                        style={{
                          width: 38, height: 38, borderRadius: 19, backgroundColor: c,
                          marginRight: 10, borderWidth: color === c ? 3 : 2,
                          borderColor: color === c ? '#fff' : 'transparent',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {color === c && <MaterialIcons name="check" size={16} color="white" />}
                      </Pressable>
                    ))}
                  </ScrollView>

                  {/* Icon */}
                  <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 12 }}>Icon</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                    {ICONS.map(ic => (
                      <Pressable
                        key={ic.name}
                        onPress={() => setIcon(ic.name)}
                        style={{
                          width: 56, height: 56, borderRadius: 14, marginRight: 10,
                          backgroundColor: icon === ic.name ? color + '28' : '#252729',
                          borderWidth: 1.5,
                          borderColor: icon === ic.name ? color : '#2D3235',
                          alignItems: 'center', justifyContent: 'center', gap: 2,
                        }}
                      >
                        <MaterialIcons name={ic.name} size={22} color={icon === ic.name ? color : '#9BA1A6'} />
                        <Text style={{ fontSize: 9, color: icon === ic.name ? color : '#9BA1A6' }}>{ic.label}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>

                  {!!error && (
                    <View style={{
                      backgroundColor: '#EF444420', borderRadius: 10, borderWidth: 1,
                      borderColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16,
                    }}>
                      <Text style={{ color: '#EF4444', fontSize: 13 }}>{error}</Text>
                    </View>
                  )}

                  <Pressable
                    onPress={handleCreate}
                    disabled={loading}
                    style={({ pressed }) => ({
                      backgroundColor: color, borderRadius: 18,
                      paddingVertical: 18,
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                      borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)',
                      borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.22)',
                      borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)',
                      borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)',
                      shadowColor: color, shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: pressed || loading ? 0.2 : 0.55, shadowRadius: 20,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Text style={{ color: 'white', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 }}>
                          Create List
                        </Text>
                        <View style={{
                          width: 28, height: 28, borderRadius: 14,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <MaterialIcons name="check" size={16} color="white" />
                        </View>
                      </>
                    )}
                  </Pressable>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function InputField({ label, value, onChange, placeholder, autoFocus }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; autoFocus?: boolean;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 8 }}>{label}</Text>
      <View style={{
        backgroundColor: '#252729', borderWidth: 1, borderColor: '#2D3235',
        borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13,
      }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#4A5258"
          style={{ color: '#ECEDEE', fontSize: 15 }}
          autoFocus={autoFocus}
        />
      </View>
    </View>
  );
}
