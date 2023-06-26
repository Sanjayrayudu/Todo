import React, { useState } from 'react';
import { Input, Button, List, Typography } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';

type Todo = {
  id: string;
  text: string;
  complete: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const addTodo = () => {
    if (value !== "") {
      const newTodos: Todo[] = [...todos, { id: uuidv4(), text: value, complete: false }];
      setTodos(newTodos);
      setValue("");
    }
  };

  const editTodo = () => {
    if (currentTodo !== null) {
      const newTodos = todos.map((todo) =>
        todo.id === currentTodo.id ? { ...todo, text: currentTodo.text } : todo);
      setTodos(newTodos);
      setIsEditing(false);
      setCurrentTodo(null);
      setValue("");
    }
  };

  const startEditTodo = (id: string) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      setIsEditing(true);
      setCurrentTodo(todo);
      setValue(todo.text);
    }
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, complete: !todo.complete } : todo
    );
    setTodos(newTodos);
  };

  const handleInputChange = (e: any) => {
    if (isEditing && currentTodo !== null) {
      setCurrentTodo(prev => prev ? {...prev, text: e.target.value} : null)
    }
    setValue(e.target.value);
  }

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo List</h1>
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Add a task"
        className="mb-3"
      />
      <Button 
        onClick={isEditing ? editTodo : addTodo}
        className={isEditing ? 'btn btn-warning' : 'btn btn-primary mb-3'}
      >
        {isEditing ? 'Confirm Edit' : 'Add'}
      </Button>
      <Input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search for a task"
        className="mb-3"
      />
      <List
        bordered
        dataSource={filteredTodos}
        renderItem={(todo) => (
          <List.Item>
            <Typography.Text
              style={{ marginRight: '20px', textDecoration: todo.complete ? 'line-through' : 'none' }}
            >
              {todo.text}
            </Typography.Text>
            <Button onClick={() => toggleTodo(todo.id)} className={todo.complete ? "btn btn-success ml-2" : "btn btn-warning ml-2"}>
              {todo.complete ? "Mark as incomplete" : "Mark as complete"}
            </Button>
            <Button onClick={() => startEditTodo(todo.id)} className="btn btn-secondary ml-2">Edit</Button>
            <Button onClick={() => deleteTodo(todo.id)} className="btn btn-danger ml-2">Delete</Button>
          </List.Item>
        )}
      />
    </div>
  );
}
