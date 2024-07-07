import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditProfile.module.scss'

const EditProfile = () => {
    const { auth } = useContext(AuthContext); 
    const { id } = useParams();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/users/user/${id}`, { headers: { 'token': auth } });
            const { name, username } = res.data;
            setName(name);
            setUsername(username);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedProfile = { name, username };
        try {
            await axios.put(`http://localhost:3000/users/user/${id}`, updatedProfile, { headers: { 'token': auth } });
            navigate('/')
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className={styles.Container}>
            <h1>Editar perfil</h1>
            <form onSubmit={handleSubmit}>
                <label>Nombre:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              
                <label>Nombre de usuario:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            
                <button type="submit">Guardar cambios</button>
            </form>
        </div>
    );
};

export { EditProfile };
