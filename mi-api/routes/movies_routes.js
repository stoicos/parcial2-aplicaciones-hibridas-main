import express from 'express';
import {
  getAllMovies,
  createMovie,
  searchMovies,
  getMoviesByDirector,
  getMovieById,
  deactivateMovie,
  updateMovie
} from '../controllers/movies_controller.js';
import { verificarToken } from '../middlewares/auth.js';

const moviesroutes = express.Router();

moviesroutes.get('/', getAllMovies);
moviesroutes.post('/', createMovie);
moviesroutes.get('/search', searchMovies);
moviesroutes.get('/:id', getMoviesByDirector);
moviesroutes.get('/movie/:id', getMovieById)
moviesroutes.put('/movie/:id', updateMovie);
moviesroutes.delete('/:id', verificarToken, (req, res) => {
  let body = req.body
  let result = deactivateMovie(req.params.id, body)
  result
      .then((director) => {
          res.status(201).json(director)
      })
      .catch((error) => {
          res.status(400).json(error)
      })
})



export { moviesroutes };
