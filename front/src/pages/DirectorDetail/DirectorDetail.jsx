import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './DirectorDetail.module.scss'

const DirectorDetail = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);

    const [director, setDirector] = useState(null);
    const [movies, setMovies] = useState([]);

    const [title, setTitle] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [year, setYear] = useState('');

    const [editSurname, setEditSurname] = useState('');
    const [editAge, setEditAge] = useState('');

    const [editMode, setEditMode] = useState(false); // Estado para controlar la edición del director
    const [addMode, setAddMode] = useState(false); // Estado para controlar la adición de película

    const navigate = useNavigate();

    const fetchDirectorAndMovies = async () => {
        try {
            // Fetch director details
            const directorRes = await axios.get(`http://localhost:3000/directors/${id}`);
            setDirector(directorRes.data);

            // Fetch movies by director
            const moviesRes = await axios.get(`http://localhost:3000/movies`, {
                params: { directorSurname: directorRes.data.surname }
            });
            // Filtrar solo las películas con status true
            const filteredMovies = moviesRes.data.filter(movie => movie.director === directorRes.data.surname && movie.status === true);
            setMovies(filteredMovies);

            // Llenar los campos de edición con los datos actuales del director
            setEditSurname(directorRes.data.surname);
            setEditAge(directorRes.data.age.toString()); // Convertir age a string para que el input type="number" funcione correctamente
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDirectorAndMovies();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMovie = { title, synopsis, year, director: director.surname };
        try {
            await axios.post("http://localhost:3000/movies", newMovie);
            fetchDirectorAndMovies();
            setTitle('');
            setSynopsis('');
            setYear('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const editedDirector = { surname: editSurname, age: parseInt(editAge) }; // Convertir age de string a número
        try {
            await axios.put(`http://localhost:3000/directors/${id}`, editedDirector, { headers: { 'token': auth } });
            fetchDirectorAndMovies(); // Actualizar los datos del director después de la edición
            setEditMode(false); // Ocultar el formulario después de guardar cambios
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/directors/${id}`, { headers: { 'token': auth } });
            navigate('/'); // Redirigir a la página principal después de eliminar el director
        } catch (error) {
            console.error(error);
        }
    };

    if (!director) return <div>Loading...</div>;

    return (
        <div className={styles.Container}>
            <h1>Director: {director.surname}</h1>
            <h2>Edad: {director.age}</h2>

            {editMode ? (
                <form onSubmit={handleEditSubmit}>
                    <input type="text" placeholder='Apellido del director' value={editSurname} onChange={(e) => setEditSurname(e.target.value)} />
                    <input type="number" placeholder='Edad del director' value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                    <button type='submit'>Guardar Cambios</button>
                </form>
            ) : (
                <button onClick={() => setEditMode(true)}>Editar Director</button>
            )}

            {addMode ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="">Título:</label>
                    <input type="text" placeholder='Título de la película' value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="">Synopsis:</label>
                    <input type="text" placeholder='Synopsis' value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
                    <label htmlFor="">Año:</label>
                    <input type="number" placeholder='Año de lanzamiento' value={year} onChange={(e) => setYear(e.target.value)} />
                    <button type='submit'>Crear película</button>
                </form>
            ) : (
                <button onClick={() => setAddMode(true)}>Crear película</button>
            )}

            {movies.length > 0 && (
                <div>
                    <h3>Películas:</h3>
                    <ul className={styles.Lista}>
                        {movies.map(movie => (
                            <li key={movie._id}>
                                <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleDelete}>Eliminar director</button>
        </div>
    );
};

export { DirectorDetail };
