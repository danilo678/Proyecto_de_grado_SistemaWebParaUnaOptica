import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { Cliente } from './entities/cliente.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';

describe('ClientesService', () => {
  let service: ClientesService;

  let clientesRepo: any;
  let conteos: Record<string, number>;

  beforeEach(async () => {
    conteos = {};

    clientesRepo = {
      findOne: jest.fn(),
      create: jest.fn((obj: any) => ({ ...obj })),
      save: jest.fn(async (entity: any) => entity),
      remove: jest.fn(async (entity: any) => entity),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      })),
      manager: {
        // el servicio pasa la clase de entidad (Venta, Receta u OrdenTrabajo)
        count: jest.fn(async (entity: any) => conteos[entity.name] ?? 0),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ClientesService,
        { provide: getRepositoryToken(Cliente), useValue: clientesRepo },
      ],
    }).compile();

    service = moduleRef.get<ClientesService>(ClientesService);
  });

  describe('create', () => {
    it('registra un cliente nuevo con CI inédito', async () => {
      clientesRepo.findOne.mockResolvedValue(null);

      const resultado = await service.create({ ci: '1234567', nombre: 'Carlos' });

      expect(resultado).toMatchObject({ ci: '1234567', nombre: 'Carlos' });
      expect(clientesRepo.save).toHaveBeenCalled();
    });

    it('rechaza el registro cuando ya existe un cliente con esa CI', async () => {
      clientesRepo.findOne.mockResolvedValue({ id: 5, ci: '1234567', nombre: 'Existente' });

      await expect(service.create({ ci: '1234567', nombre: 'Duplicado' })).rejects.toThrow(
        new ConflictException('Ya existe un cliente con esa CI'),
      );
      expect(clientesRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('lanza NotFound cuando el cliente no existe', async () => {
      clientesRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('rechaza actualizar la CI a una que pertenece a otro cliente', async () => {
      clientesRepo.findOne
        .mockResolvedValueOnce({ id: 1, ci: '111', nombre: 'Actual' }) // findOne(id)
        .mockResolvedValueOnce({ id: 2, ci: '222', nombre: 'Otro' }); // búsqueda de duplicado

      await expect(service.update(1, { ci: '222' })).rejects.toThrow(
        new ConflictException('Ya existe un cliente con esa CI'),
      );
    });
  });

  describe('remove', () => {
    it('impide eliminar un cliente con ventas registradas', async () => {
      clientesRepo.findOne.mockResolvedValue({ id: 3, ci: '333', nombre: 'Con deudas' });
      conteos = { Venta: 2, Receta: 0, OrdenTrabajo: 0 };

      await expect(service.remove(3)).rejects.toThrow(/ventas registradas/);
      expect(clientesRepo.remove).not.toHaveBeenCalled();
    });

    it('elimina al cliente cuando no tiene registros asociados', async () => {
      clientesRepo.findOne.mockResolvedValue({ id: 4, ci: '444', nombre: 'Sin movimientos' });

      await service.remove(4);

      expect(clientesRepo.remove).toHaveBeenCalledWith({ id: 4, ci: '444', nombre: 'Sin movimientos' });
    });
  });
});
