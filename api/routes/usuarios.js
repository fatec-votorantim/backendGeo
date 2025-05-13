import express from 'express'
import {insereUsuario, efetuaLogin} from '../controllers/usuarios.js'
import {validateUsuario} from '../middleware/validation.js'

const router = express.Router()
//Cria novo usuário
router.post('/', validateUsuario, insereUsuario)
//Valida o login
router.post('/login', efetuaLogin)

export default router