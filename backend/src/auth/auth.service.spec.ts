import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const usuariosService = { findByUsername: jest.fn(), findOne: jest.fn() };
  const jwtService = { sign: jest.fn() };

  // hash real de bcrypt para ejercitar la comparación auténtica
  const CLAVE = 'admin123';
  const usuarioBD = {
    id: 1,
    usuario: 'admin',
    password: bcrypt.hashSync(CLAVE, 10),
    rol: { nombre: 'Administrador' },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    service = new AuthService(usuariosService as any, jwtService as any);
  });

  describe('validateUser', () => {
    it('devuelve el usuario sin la contraseña cuando las credenciales son correctas', async () => {
      usuariosService.findByUsername.mockResolvedValue(usuarioBD);

      const resultado = await service.validateUser('admin', CLAVE);

      expect(resultado).toEqual({ id: 1, usuario: 'admin', rol: { nombre: 'Administrador' } });
      expect(resultado.password).toBeUndefined();
    });

    it('devuelve null cuando la contraseña es incorrecta', async () => {
      usuariosService.findByUsername.mockResolvedValue(usuarioBD);

      const resultado = await service.validateUser('admin', 'otra-clave');

      expect(resultado).toBeNull();
    });

    it('devuelve null cuando el usuario no existe', async () => {
      usuariosService.findByUsername.mockResolvedValue(null);

      const resultado = await service.validateUser('fantasma', 'lo-que-sea');

      expect(resultado).toBeNull();
    });
  });

  describe('login', () => {
    it('firma el token con sub, usuario y rol, y devuelve el perfil completo', async () => {
      const fullUser = { ...usuarioBD, nombre: 'Admin' };
      usuariosService.findOne.mockResolvedValue(fullUser);
      jwtService.sign.mockReturnValue('jwt-firmado');

      const resultado = await service.login({ id: 1, usuario: 'admin', rol: usuarioBD.rol });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        usuario: 'admin',
        rol: { nombre: 'Administrador' },
      });
      expect(resultado.access_token).toBe('jwt-firmado');
      expect(resultado.user).toEqual(fullUser);
    });
  });
});
