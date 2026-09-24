import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Todo } from '../types/todo';
import { useAuth } from './use-auth';
import { createTodo, updateTodo, deleteTodo, toggleTodo } from '../lib/firestore';

export function useTodos() {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setTodos([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', currentUser.uid, 'todos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      setTodos(todosData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const add = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentUser) {
      await createTodo(currentUser.uid, todoData);
    }
  };

  const update = async (todoId: string, todoData: Partial<Todo>) => {
    if (currentUser) {
      await updateTodo(currentUser.uid, todoId, todoData);
    }
  };

  const remove = async (todoId: string) => {
    if (currentUser) {
      await deleteTodo(currentUser.uid, todoId);
    }
  };

  const toggle = async (todoId: string, currentStatus: boolean) => {
    if (currentUser) {
      await toggleTodo(currentUser.uid, todoId, currentStatus);
    }
  };

  return { todos, loading, add, update, remove, toggle };
}
