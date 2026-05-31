import { useEffect, useState, useCallback } from 'react';
import { FlatList, Pressable, RefreshControl, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import TaskItem from '@/components/TaskItem/TaskItem';
import EmptyState from '@/components/EmptyState/EmptyState';
import CreateTaskSheet from '@/components/CreateTaskSheet/CreateTaskSheet';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Task } from '@/types/Task';
import { TaskList } from '@/types/TaskList';
import { getTaskListById } from '@/services/tasks/taskLists';
import { getTaskItems, toggleTaskItem, deleteTaskItem } from '@/services/tasks/taskItems';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [list, setList] = useState<TaskList | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const color = list?.idColor ?? '#0a7ea4';

  const load = useCallback(async () => {
    try {
      const [listData, itemsData] = await Promise.all([
        getTaskListById(id),
        getTaskItems(id),
      ]);
      setList(listData);
      setTasks(itemsData);
    } catch {
      Alert.alert('Error', 'Could not load tasks');
    }
  }, [id]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    try {
      await toggleTaskItem(id, taskId, !task.completed);
    } catch {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: task.completed } : t));
    }
  };

  const handleDelete = (taskId: string) => {
    Alert.alert('Delete task', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          setTasks(prev => prev.filter(t => t.id !== taskId));
          try {
            await deleteTaskItem(id, taskId);
          } catch {
            await load();
          }
        },
      },
    ]);
  };

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  const ListHeader = (
    <View style={{ paddingTop: 8, marginBottom: 8 }}>
      {/* Progress card */}
      <View style={{
        backgroundColor: '#1E2122', borderRadius: 20,
        borderWidth: 1, borderColor: '#2D3235',
        padding: 20, marginBottom: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15, shadowRadius: 10,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#9BA1A6', fontSize: 13, marginBottom: 2 }}>
              {list?.subtitle || 'No description'}
            </Text>
            <Text style={{ color: '#ECEDEE', fontSize: 13 }}>
              {done} of {total} completed
            </Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: '800', color }}>
            {percentage}%
          </Text>
        </View>
        <View style={{ height: 8, backgroundColor: '#2D3235', borderRadius: 99, overflow: 'hidden' }}>
          <View style={{
            height: '100%', width: `${percentage}%`,
            backgroundColor: color, borderRadius: 99,
          }} />
        </View>
      </View>

      {/* Section header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#ECEDEE' }}>Tasks</Text>
        <Pressable
          onPress={() => setShowCreate(true)}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: color,
            paddingLeft: 8, paddingRight: 14, paddingVertical: 8,
            borderRadius: 14,
            borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)',
            borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.22)',
            borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)',
            borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)',
            shadowColor: color, shadowOffset: { width: 0, height: 5 },
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
          <Text style={{ fontSize: 13, color: 'white', fontWeight: '800' }}>Add task</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Loading…' }} />
        <View style={{ flex: 1, backgroundColor: '#151718', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="large" color="#0a7ea4" />
        </View>
      </>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#151718' }}>
      <Stack.Screen options={{
        title: list?.title ?? 'Tasks',
        headerTintColor: color,
        headerStyle: { backgroundColor: '#151718' },
        headerShadowVisible: false,
      }} />

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <EmptyState
              icon="check-circle-outline"
              title="No tasks yet"
              subtitle="Add your first task to get started"
            />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        />

        {/* FAB extendido */}
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
            backgroundColor: color,
            paddingVertical: 18,
            borderRadius: 20,
            borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)',
            borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.22)',
            borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)',
            borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)',
            shadowColor: color,
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
            Add Task
          </Text>
        </Pressable>
      </View>

      <CreateTaskSheet
        visible={showCreate}
        listId={id}
        onClose={() => setShowCreate(false)}
        onCreated={task => {
          setTasks(prev => [task, ...prev]);
          setShowCreate(false);
        }}
      />
    </View>
  );
}
