import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styles from './MovieDetail.module.scss';

const MovieDetail = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editSynopsis, setEditSynopsis] = useState('');
    const [editYear, setEditYear] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movieRes = await axios.get(`http://localhost:3000/movies/movie/${id}`);
                setMovie(movieRes.data);
                setEditTitle(movieRes.data.title);
                setEditSynopsis(movieRes.data.synopsis);
                setEditYear(movieRes.data.year.toString()); // Convertir year a string para que el input type="number" funcione correctamente
            } catch (error) {
                console.error(error);
            }
        };
        fetchMovie();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/movies/${id}`, { headers: { 'token': auth } });
            navigate(`/`); // Redirigir a la página principal después de eliminar la película
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const editedMovie = {
            title: editTitle,
            synopsis: editSynopsis,
            year: parseInt(editYear)
        };
        try {
            await axios.put(`http://localhost:3000/movies/movie/${id}`, editedMovie, { headers: { 'token': auth } });
            setMovie({ ...movie, title: editTitle, synopsis: editSynopsis, year: editYear }); // Actualizar el estado local de la película
            setEditMode(false); // Ocultar el formulario de edición
        } catch (error) {
            console.error(error);
        }
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <>
            <div className={styles.Container}>
                {!editMode ? (
                    <>
                        <h1>{movie.title}</h1>
                        <p><strong>Director:</strong> {movie.director}</p>
                        <p><strong>Synopsis:</strong> {movie.synopsis}</p>
                        <p><strong>Año de lanzamiento:</strong> {movie.year}</p>
                        <button onClick={() => setEditMode(true)}>Editar Película</button>
                    </>
                ) : (
                    <form onSubmit={handleEditSubmit}>
                        <input type="text" placeholder="Título" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        <input type="text" placeholder="Sinopsis" value={editSynopsis} onChange={(e) => setEditSynopsis(e.target.value)} />
                        <input type="number" placeholder="Año" value={editYear} onChange={(e) => setEditYear(e.target.value)} />
                        <button type="submit">Guardar Cambios</button>
                    </form>
                )}
                <button onClick={handleDelete}>Eliminar Película</button>
            </div>
            
        </>
    );
};

export { MovieDetail };
