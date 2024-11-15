import React from "react";

/* 
const defaultTodos = [
  { text: 'Cortar cebolla', completed: true },
  { text: 'Tomar el curso de intro a React', completed: false },
  { text: 'Llorar con la llorona', completed: false },
  { text: 'LALALALALA', completed: false },
];
localStorage.setItem('TODOS_V1', JSON.stringify(defaultTodos)); 
*/

// localStorage.removeItem('TODOS_V1');

function useLocalStorage(itemName, initialValue) {
    const [item, setItem] = React.useState(initialValue);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => {
            try {
                const localStorageItem = localStorage.getItem(itemName);
                let parsedItem;
                if (!localStorageItem) {
                    localStorage.setItem('TODOS_V1', JSON.stringify(initialValue));
                    parsedItem = initialValue;
                } else {
                    parsedItem = JSON.parse(localStorageItem);
                    setItem(parsedItem);
                };
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(true);
            };
        }, 2000);
    }, []);

    const saveItem = (newItem) => {
        localStorage.setItem('TODOS_V1', JSON.stringify(newItem));
        setItem(newItem);
    };
    return {
        item,
        saveItem,
        loading,
        error
    };
};

const TodoContext = React.createContext();

function TodoProvider({ children }) {
    const {
        item: todos, 
        saveItem: saveTodos, 
        loading, 
        error
      } = useLocalStorage("TODOS_V1", []);
      const [searchValue, setSearchValue] = React.useState("");

      const [openModal, setOpenModal] = React.useState(false);
    
      const completedTodos = todos.filter(todo => !!todo.completed).length;
      const totalTodos = todos.length;
    
      const searchedTodos = todos.filter(todo => {
        return todo.text.toLowerCase().includes(searchValue.toLowerCase())
      });
    
      const addTodo = (text) => {
        const newTodos = [...todos];
        newTodos.push({
          text,
          completed: false,
        });
        saveTodos(newTodos);
      };

      const completeTodo = (text) => {
        const newTodos = [...todos];
        const todoIndex = newTodos.findIndex(todo => todo.text === text);
        newTodos[todoIndex].completed = !newTodos[todoIndex].completed;
        saveTodos(newTodos);
      };
    
      const deleteTodo = (text) => {
        const newTodos = [...todos];
        const todoIndex = newTodos.findIndex(todo => todo.text === text);
        newTodos.splice(todoIndex, 1);
        saveTodos(newTodos);
      };

    return (
        <TodoContext.Provider value={{
            loading,
            error,
            totalTodos,
            completedTodos,
            searchValue,
            setSearchValue,
            searchedTodos,
            completeTodo,
            deleteTodo,
            openModal,
            setOpenModal,
            addTodo,
        }}>
            {children}
        </TodoContext.Provider>
    );
};

export { 
    TodoContext,
    TodoProvider
};

