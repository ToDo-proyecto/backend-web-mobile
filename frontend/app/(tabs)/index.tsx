import { useEffect, useState, useCallback } from 'react';
import { FlatList, Pressable, RefreshControl, View, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import TaskListCard from '@/components/TaskListCard/TaskListCard';
import EmptyState from '@/components/EmptyState/EmptyState';
import CreateListSheet from '@/components/CreateListSheet/CreateListSheet';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { TaskList } from '@/types/TaskList';
import { getTaskLists, deleteTaskList } from '@/services/tasks/taskLists';
import { useAuth } from '@/contexts/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const loadLists = useCallback(async () => {
    try {
      setError(null);
      const data = await getTaskLists();
      setLists(data);
    } catch {
      setError('Could not load lists.\nIs the backend running?');
    }
  }, []);

  useEffect(() => {
    loadLists().finally(() => setLoading(false));
  }, [loadLists]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  const handleLongPress = (item: TaskList) => {
    Alert.alert(item.title, undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete list',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTaskList(item.id);
            setLists(prev => prev.filter(l => l.id !== item.id));
          } catch {
            Alert.alert('Error', 'Could not delete the list');
          }
        },
      },
    ]);
  };

  const avg = lists.length ? Math.round(lists.reduce((s, l) => s + l.percentage, 0) / lists.length) : 0;
  const completed = lists.filter(l => l.percentage === 100).length;
  const statW = (width - 48 - 16) / 3;

  const ListHeader = (
    <View style={{ paddingTop: 8 }}>
      {/* Greeting */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#ECEDEE', letterSpacing: -0.2 }} numberOfLines={1} adjustsFontSizeToFit>
          {getGreeting()}, {firstName}!
        </Text>
        <Text style={{ fontSize: 13, color: '#9BA1A6', marginTop: 3 }}>{date}</Text>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 28 }}>
        {[
          { label: 'Lists', value: String(lists.length), color: '#0a7ea4' },
          { label: 'Avg. Progress', value: `${avg}%`, color: '#8B5CF6' },
          { label: 'Done', value: String(completed), color: '#10B981' },
        ].map(s => (
          <View key={s.label} style={{
            width: statW,
            backgroundColor: '#1E2122',
            borderWidth: 1, borderColor: '#2D3235',
            borderRadius: 18, padding: 14, alignItems: 'center',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15, shadowRadius: 6,
          }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: s.color }}>{s.value}</Text>
            <Text style={{ fontSize: 11, color: '#9BA1A6', marginTop: 3, textAlign: 'center' }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Section header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 19, fontWeight: '700', color: '#ECEDEE' }}>My Lists</Text>
        <Pressable
          onPress={() => setShowCreate(true)}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: '#0a7ea4',
            paddingLeft: 8, paddingRight: 14, paddingVertical: 8,
            borderRadius: 14,
            borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)',
            borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.22)',
            borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)',
            borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)',
            shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 5 },
            shadowOpacity: pressed ? 0.2 : 0.45, shadowRadius: 10, elevation: 6,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <View style={{
            width: 24, height: 24, borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <MaterialIcons name="add" size={16} color="white" />
          </View>
          <Text style={{ fontSize: 13, color: 'white', fontWeight: '800' }}>New List</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="large" color="#0a7ea4" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {error ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="wifi-off" size={52} color="#4A5258" />
            <Text style={{ color: '#9BA1A6', marginTop: 12, textAlign: 'center', lineHeight: 22 }}>{error}</Text>
            <Pressable
              onPress={loadLists}
              style={{ marginTop: 20, backgroundColor: '#0a7ea4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={lists}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TaskListCard
                item={item}
                onPress={() => router.push({ pathname: '/lists/[id]' as any, params: { id: item.id } })}
                onLongPress={() => handleLongPress(item)}
              />
            )}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={
              <EmptyState
                icon="playlist-add"
                title="No lists yet"
                subtitle="Tap + New or the button below to create your first list"
              />
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0a7ea4" />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          />
        )}

        {/* FAB extendido */}
        {!error && (
          <Pressable
            onPress={() => setShowCreate(true)}
            style={({ pressed }) => ({
              position: 'absolute',
              bottom: insets.bottom + 20,
              left: 0, right: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: '#0a7ea4',
              paddingVertical: 18,
              borderRadius: 20,
              borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)',
              borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.22)',
              borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)',
              borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)',
              shadowColor: '#0a7ea4',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: pressed ? 0.2 : 0.55,
              shadowRadius: 20,
              elevation: 12,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View style={{
              width: 30, height: 30, borderRadius: 15,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <MaterialIcons name="add" size={20} color="white" />
            </View>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 }}>
              New List
            </Text>
          </Pressable>
        )}
      </View>

      <CreateListSheet
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={newList => {
          setLists(prev => [newList, ...prev]);
          setShowCreate(false);
        }}
      />
    </SafeAreaView>
  );
}
