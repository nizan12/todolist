import { db } from './firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { Todo } from '../types/todo';

export const createTodo = async (userId: string, todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
  const todosRef = collection(db, 'users', userId, 'todos');
  const newTodoRef = doc(todosRef);
  
  const todo = {
    ...todoData,
    id: newTodoRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(newTodoRef, todo);
  return todo;
};

export const updateTodo = async (userId: string, todoId: string, todoData: Partial<Todo>) => {
  const todoRef = doc(db, 'users', userId, 'todos', todoId);
  await updateDoc(todoRef, {
    ...todoData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTodo = async (userId: string, todoId: string) => {
  const todoRef = doc(db, 'users', userId, 'todos', todoId);
  await deleteDoc(todoRef);
};

export const toggleTodo = async (userId: string, todoId: string, currentStatus: boolean) => {
  const todoRef = doc(db, 'users', userId, 'todos', todoId);
  await updateDoc(todoRef, {
    completed: !currentStatus,
    updatedAt: serverTimestamp(),
  });
};
