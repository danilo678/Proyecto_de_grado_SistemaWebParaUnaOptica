import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { VentasService } from './ventas.service';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Recibo } from './entities/recibo.entity';
import { Producto } from '../productos/entities/producto.entity';

describe('VentasService', () => {
  let service: VentasService;

  let ventasRepo: Record<string, jest.Mock>;
  let detalleRepo: Record<string, jest.Mock>;
  let productosRepo: Record<string, jest.Mock>;
  let queryRunner: any;
  let idCounter: number;

  const buildDto = (overrides: Partial<any> = {}) => ({
    clienteId: 1,
    usuarioId: 2,
    detalles: [{ productoId: 10, cantidad: 2, precioUnitario: 100 }],
    ...overrides,
  });

  beforeEach(async () => {
    idCounter = 0;

    ventasRepo = { findOne: jest.fn(), count: jest.fn(), createQueryBuilder: jest.fn() };
    detalleRepo = { createQueryBuilder: jest.fn() };
    productosRepo = {};

    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        create: jest.fn((_cls: any, obj: any) => ({ ...obj })),
        // simula la BD asignando id a entidades nuevas
        save: jest.fn(async (entity: any) => {
          if (entity && entity.id === undefined) entity.id = ++idCounter;
          return entity;
        }),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        VentasService,
        { provide: getRepositoryToken(Venta), useValue: ventasRepo },
        { provide: getRepositoryToken(DetalleVenta), useValue: detalleRepo },
        { provide: getRepositoryToken(Producto), useValue: productosRepo },
        { provide: DataSource, useValue: { createQueryRunner: () => queryRunner } },
      ],
    }).compile();

    service = moduleRef.get<VentasService>(VentasService);
  });

  describe('create', () => {
    it('registra la venta, descuenta el stock y genera el recibo REC-0001', async () => {
      const producto = { id: 10, nombre: 'Montura X', stock: 5 };
      queryRunner.manager.findOne.mockResolvedValue(producto);

      const ventaCompleta = { id: 1, total: 200 };
      ventasRepo.findOne.mockResolvedValue(ventaCompleta);

      const resultado = await service.create(buildDto());

      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(resultado).toBe(ventaCompleta);
      expect(producto.stock).toBe(3); // 5 - 2 vendidos

      const reciboCreado = queryRunner.manager.create.mock.calls
        .map((c: any[]) => c[1])
        .find((obj: any) => obj.numeroRecibo !== undefined);
      expect(reciboCreado.numeroRecibo).toBe('REC-0001');
      expect(reciboCreado.montoPagado).toBe(200); // sin monto explícito paga el total
      expect(reciboCreado.saldo).toBe(0);
    });

    it('calcula el saldo cuando el cliente deja un anticipo', async () => {
      queryRunner.manager.findOne.mockResolvedValue({ id: 10, nombre: 'Lente', stock: 10 });
      ventasRepo.findOne.mockResolvedValue({ id: 1 });

      await service.create(buildDto({ montoPagado: 50 }));

      const reciboCreado = queryRunner.manager.create.mock.calls
        .map((c: any[]) => c[1])
        .find((obj: any) => obj.saldo !== undefined);
      expect(reciboCreado.montoPagado).toBe(50);
      expect(reciboCreado.saldo).toBe(150); // total 200 - 50 de anticipo
    });

    it('rechaza la venta cuando el stock es insuficiente y hace rollback', async () => {
      queryRunner.manager.findOne.mockResolvedValue({ id: 10, nombre: 'Montura Y', stock: 1 });

      await expect(service.create(buildDto())).rejects.toThrow(BadRequestException);

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('rechaza la venta si el producto no existe', async () => {
      queryRunner.manager.findOne.mockResolvedValue(null);

      await expect(
        service.create(buildDto({ detalles: [{ productoId: 999, cantidad: 1, precioUnitario: 10 }] })),
      ).rejects.toThrow(BadRequestException);

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('rechaza un monto pagado mayor al total de la venta', async () => {
      queryRunner.manager.findOne.mockResolvedValue({ id: 10, nombre: 'Accesorio', stock: 20 });

      await expect(service.create(buildDto({ montoPagado: 500 }))).rejects.toThrow(
        /no puede ser negativo ni mayor al total/,
      );
    });
  });

  describe('findOne', () => {
    it('lanza NotFound cuando la venta no existe', async () => {
      ventasRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
});
