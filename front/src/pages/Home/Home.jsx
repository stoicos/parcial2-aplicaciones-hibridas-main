import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss'

const Home = () => {
    const { auth, user, logoutUser } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    const [directors, setDirectors] = useState([]);
    const [surname, setSurname] = useState('');
    const [age, setAge] = useState('');
    const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

    useEffect(() => {
        fetchDirectors();
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/users/user/${user.id}`, { headers: { 'token': auth } });
            const { name, username } = res.data;
            setName(name);
            setUsername(username);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDirectors = async () => {
        try {
            const res = await axios.get("http://localhost:3000/directors");
            // Filtrar solo los directores con status true
            const filteredDirectors = res.data.filter(director => director.status === true);
            setDirectors(filteredDirectors);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDirector = { surname, age };
        try {
            await axios.post("http://localhost:3000/directors", newDirector);
            fetchDirectors();
            setSurname('');
            setAge('');
            setShowForm(false); // Ocultar el formulario después de agregar un director
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.Container}>
            <i>{name ? "Bienvenido " + username : "Ingresa para ver películas"}</i>
            <h1>Directores</h1>

            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancelar' : 'Añadir director'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="">Apellido:</label>
                    <input type="text" placeholder='Apellido del director' value={surname} onChange={(e) => setSurname(e.target.value)} />
                    <label htmlFor="">Edad:</label>
                    <input type="number" placeholder='Edad del director' value={age} onChange={(e) => setAge(e.target.value)} />
                    <button type='submit'>Crear director</button>
                </form>
            )}

            <ul className={styles.Lista}>
                {directors.map(director => (
                    <li key={director._id}>
                        <Link to={`/directors/${director._id}`}>{director.surname}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export { Home };
