
import React, { useState, useEffect } from 'react';
import { Layout, Drawer, Form, Input, Table, Button, Typography, notification   } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {addUser,deleteUser,fetchUsers} from '../services/userService'
import CustomHeader from '../components/header/Header'; 
import {openErrorNotification,openSuccessNotification} from '../utils/notifications' 

const { Content } = Layout;
const { TextArea } = Input;

export default function Agenda(){
    const [users, setUsers] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Controlar si el Drawer está abierto
    const [searchText, setSearchText] = useState('');
    const [newContact, setNewContact] = useState({ name: '', description: '', photo: '' }); // Datos del nuevo contacto
   const [filteredUsers, setFilteredUsers] = useState(users);

   
    // Cargar usuarios desde la API
    useEffect(() => {
        const loadUsers = async () => {
            try {                
                const data = await fetchUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                openErrorNotification('Hubo un error al cargar los datos.');               
                console.error('Error fetching users:', error);
            }
        };
        loadUsers();
    }, []); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContact({ ...newContact, [name]: value });
    };

    const handleSearchChange = (e) => {
        
        const value = e.target.value;
        console.log(e.target.value);
        setSearchText(value);
        // Filtra los usuarios por nombre o descripción
        const filtered = users.filter(
            user =>
                user.name.toLowerCase().includes(value.toLowerCase()) ||
                user.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered); // Actualiza los usuarios filtrados
       
    };

   
    // Agregar nuevo contacto a la API
    const handleAddContact = async () => {
        if (newContact.name && newContact.description && newContact.photo) {
            try {
                const newUser = await addUser(newContact); // El servidor debe devolver el usuario con el 'id'
                setUsers((prevUsers) => [...prevUsers, newUser]); // Usa el objeto devuelto para incluir el 'id'
                setFilteredUsers((prevUsers) => [...prevUsers, newUser]);
                setNewContact({ name: '', description: '', photo: '' });
                openSuccessNotification('Contacto agregado con éxito');
                setIsDrawerOpen(false);
            } catch (error) {
                openErrorNotification('Hubo un error al agregar contacto.');
                console.error('Error adding contact:', error);
            }
        } else {
            openErrorNotification('Por favor complete todos los campos antes de agregar.');
        }
    };

   
     // Eliminar usuario de la lista
     const handleDeleteUser = async (id) => {
        try {
          
            await deleteUser(id);
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
            setFilteredUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
            openSuccessNotification('Contacto eliminado con éxito');
        } catch (error) {
            openErrorNotification('Error al eliminar contacto.');
            console.error('Error deleting user:', error);
        }
    };

    const handleCancel = () => {
        setNewContact({ name: '', description: '', photo: '' }); // Resetear formulario       
        setIsDrawerOpen(false); // Cerrar el Drawer
    };


    const confirmClick= (user) => {

        if(confirm("¿Está seguro de realizar esta operación?")){
            handleDeleteUser(user.id);
        }
    }
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name', // Aquí debe coincidir con la clave en el objeto 'users'
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={record.photo} // Usamos el valor de 'photo' como la URL de la imagen
                        alt="Foto de perfil"
                        style={{
                            width: '40px', // Ajusta el tamaño de la imagen
                            height: '40px', // Ajusta el tamaño de la imagen
                            borderRadius: '50%', // Redondea la imagen
                            marginRight: '10px', // Espacio entre la imagen y el nombre
                        }}
                    />
                    {text} {/* Mostrar el nombre */}
                </div>
            ),
        },
        {
            title: 'Descripción',
            dataIndex: 'description', // Aquí también debe coincidir con la clave en el objeto 'users'
            key: 'description',
        },
        
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Button type="danger" onClick={() => confirmClick(record)}>
                    <DeleteOutlined />
                </Button>
            ),
        },
    ];

    return (
    
    <Layout style={{ minHeight: '100vh' }}>
        <CustomHeader />
            <Content
                style={{
                    padding: '0 50px',
                    marginTop: 64, // Ajusta según si tienes un encabezado
                }}
            >
    <div>
        <h1>Agenda Previred - Mi Agenda de contactos laboral</h1>
       <h4> Aquí podrá encontrar o buscar a todos sus contactos agregados, agregar nuevos contactos y eliminar contactos no deseados.</h4>       
       
        <Button className='color-boton-previred' type="primary" style={{ marginBottom: 20 }} onClick={() => setIsDrawerOpen(true)}>+ Agregar nuevo contacto </Button><br />
        {/* Campo de búsqueda */}
       <Input.Search
                        placeholder="Buscar contacto"
                        value={searchText}
                        onChange={handleSearchChange}
                        onSearch={(value) => console.log(value)} // Lógica de búsqueda
                        style={{ width: 300, marginBottom: 20 }}
                    />        
           
    </div>
    <div>
    <Table
                    dataSource={filteredUsers}
                    columns={columns}
                    rowKey="id" // Establecer "id" como la clave para cada fila
                    pagination={{
                        position: ['topRight', 'bottomRight'], // Mostrar el paginador arriba y abajo, centrado
                        pageSize: 6, // Número de filas por página
                      }}
                />
               
    </div>
    </Content>
          
           
            <Drawer
               title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Agregar nuevo contacto</span>
                    <div>
                        <Button type="default" onClick={handleCancel} style={{ marginRight: 10 }}>
                            Cancelar
                        </Button>
                        <Button className='color-boton-previred' type="primary" onClick={handleAddContact}>
                            Agregar
                        </Button>
                    </div>
                </div>
            }
                width={720}
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                bodyStyle={{ paddingBottom: 80 }}
                headerStyle={{
                    display: 'flex',
                    justifyContent: 'space-between', // Distribuir el espacio entre el título y los botones
                    alignItems: 'center',
                }}
            >           
            <Form
                
                layout="vertical" // Establecer el diseño del formulario a vertical
                onFinish={handleAddContact} // Llamar la función al enviar el formulario
            >
                <Form.Item label="URL imagen de perfil" name="photo" required>
                    <Input
                        type="text"
                        name="photo"
                        value={newContact.photo}
                        onChange={handleInputChange}
                    />
                </Form.Item>

                <Form.Item label="Nombre" name="name" required>
                    <Input
                        type="text"
                        name="name"
                        value={newContact.name}
                        onChange={handleInputChange}
                    />
                </Form.Item>

                <Form.Item label="Descripción" name="description" required>
                    <TextArea
                        name="description"
                        value={newContact.description}
                        onChange={handleInputChange}
                        rows={4}
                    />
                </Form.Item>

            
            </Form>                   
        </Drawer> 
                
               
            
            
</Layout>
    
    );
    
}
