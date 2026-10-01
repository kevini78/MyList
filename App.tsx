import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';

const colors = {
  ciano: '#00CBCE',
  blue: '#109AE5',
  blueLogo: '#4EA8DE',
  blueButton: '#007CB5',
  white: '#F5F5F5',
  gray300: '#7A7A7A',
  gray500: '#333333',
  gray700: '#262626',
  black500: '#181818',
  black700: '#0D0D0D',
  black900: '#0A0A0A',
};

type Task = { id: string; title: string; done: boolean };

function Counter({ value }: { value: number }) {
  return (
    <View style={styles.counter}>
      <Text style={styles.counterText}>{value}</Text>
    </View>
  );
}

function Empty() {
  return (
    <View style={styles.empty}>
      <MaterialCommunityIcons name="clipboard-text-outline" size={56} color={colors.gray500} />
      <Text style={styles.emptyText}>
        <Text style={styles.emptyBold}>Sua lista ainda está vazia{'\n'}</Text>
        Adicione algo para se organizar
      </Text>
    </View>
  );
}

function TaskItem({
  task,
  onToggle,
  onRemove,
}: {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.task}>
      <Pressable onPress={onToggle} hitSlop={8}>
        <Ionicons
          name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={task.done ? colors.blueButton : colors.blue}
        />
      </Pressable>
      <Text style={[styles.taskText, task.done && styles.taskDone]}>{task.title}</Text>
      <Pressable onPress={onRemove} hitSlop={8}>
        <Feather name="trash-2" size={18} color={colors.gray300} />
      </Pressable>
    </View>
  );
}

function Home() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const created = tasks.length;
  const done = tasks.filter((t) => t.done).length;

  const add = () => {
    const title = text.trim();
    if (!title) return;
    setTasks((prev) => [{ id: String(Date.now()), title, done: false }, ...prev]);
    setText('');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { height: 173 + Math.max(insets.top - 46, 0) }]}>
        <View style={[styles.logo, { marginTop: Math.max(insets.top, 46) + 24 }]}>
          <MaterialIcons name="playlist-add-check" size={32} color={colors.ciano} />
          <Text style={styles.logoText}>
            <Text style={{ color: colors.ciano }}>My</Text>
            <Text style={{ color: colors.blue }}>List</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.newTask, { top: Math.max(insets.top, 46) + 96 }]}>
        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          placeholder="Adicione algo a sua lista"
          placeholderTextColor={colors.gray300}
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <Pressable
          onPress={add}
          style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.8 }]}
        >
          <Feather name="plus-circle" size={16} color={colors.white} />
        </Pressable>
      </View>

      <View style={[styles.tasks, { top: Math.max(insets.top, 46) + 182 }]}>
        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.ciano }]}>Criadas</Text>
            <Counter value={created} />
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.blue }]}>Concluídas</Text>
            <Counter value={done} />
          </View>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={(t) => t.id}
          ListEmptyComponent={Empty}
          contentContainerStyle={styles.list}
          style={styles.listWrap}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() =>
                setTasks((prev) => prev.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t)))
              }
              onRemove={() => setTasks((prev) => prev.filter((t) => t.id !== item.id))}
            />
          )}
        />
      </View>
    </View>
  );
}

export default function App() {
  const [loaded] = useFonts({ Inter_400Regular, Inter_700Bold, Inter_900Black });
  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.black900 }} />;
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Home />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black900 },
  header: { backgroundColor: colors.black500, alignItems: 'center' },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoText: { fontFamily: 'Inter_900Black', fontSize: 24, lineHeight: 28 },
  newTask: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 4,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray700,
    borderWidth: 1,
    borderColor: colors.black700,
    borderRadius: 6,
    padding: 16,
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  inputFocused: { borderColor: colors.blueButton },
  addButton: {
    backgroundColor: colors.blueButton,
    borderRadius: 6,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasks: { position: 'absolute', left: 24, right: 24, bottom: 0, gap: 20 },
  info: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  counter: {
    backgroundColor: colors.gray500,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: colors.white },
  listWrap: { borderTopWidth: 1, borderTopColor: colors.gray500 },
  list: { gap: 8, paddingTop: 20, paddingBottom: 40, flexGrow: 1 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray300,
    textAlign: 'center',
  },
  emptyBold: { fontFamily: 'Inter_700Bold' },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.gray700,
    borderWidth: 1,
    borderColor: colors.black700,
    borderRadius: 8,
    padding: 16,
  },
  taskText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.white },
  taskDone: { textDecorationLine: 'line-through', color: colors.gray300 },
});
