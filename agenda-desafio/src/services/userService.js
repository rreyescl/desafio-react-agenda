const API_URL = 'http://localhost:9000/api/users';

export const fetchUsers = async () => {
    console.log("entrando a fetchUsers Service");
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar los usuarios');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addUser = async (user) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Error al agregar usuario');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar usuario');
  } catch (error) {
    console.error(error);
    throw error;
  }
};
