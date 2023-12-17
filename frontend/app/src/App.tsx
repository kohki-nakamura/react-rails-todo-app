import React, { useEffect, useState } from 'react';
import { TodoType } from './types/todo.ts';
import { createTodo, deleteTodo, getTodos, updateTodo } from './lib/api/todos.ts';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';

const App = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [title, setTitle] = useState('');

  const handleCreateTodo = async () => {
    try {
      const response = await createTodo({
        title: title,
        completed: false,
      });

      setTodos([...todos, response.data]);
      setTitle('');
    } catch (err) {
      console.log(err);
      alert('作成に失敗しました。');
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const response = await updateTodo(id, {
      completed: !completed,
    });

    setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  useEffect(() => {
    getTodos().then((response) => setTodos(response.data));
  }, []);

  return (
    <VStack spacing={4} padding={4}>
      <Heading as="h1" mb={8}>
        Todoアプリ
      </Heading>
      <Flex>
        <Input
          placeholder="Todoを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          colorScheme="blue"
          ml={4}
        >
          <AddIcon onClick={handleCreateTodo} />
        </Button>
      </Flex>

      {todos.map((todo) => (
        <Box
          key={todo.id}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Checkbox
            isChecked={todo.completed}
            onChange={() => handleToggleTodo(todo.id, todo.completed)}
          >
            {todo.title}
          </Checkbox>
          <DeleteIcon onClick={() => handleDeleteTodo(todo.id)} />
        </Box>
      ))}
    </VStack>
  )
}

export default App;
