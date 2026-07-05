import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { MetodoPago, EstadoPago } from './pago.entity';

const PAGO_ID      = '11111111-1111-1111-1111-111111111111';
const PACIENTE_ID  = '33333333-3333-3333-3333-333333333333';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('PagosController', () => {
  let controller: PagosController;

  const mockPagosService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagosController],
      providers: [
        { provide: PagosService, useValue: mockPagosService },
      ],
    }).compile();

    controller = module.get<PagosController>(PagosController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    const dto = { pacienteId: PACIENTE_ID, monto: 50, metodoPago: MetodoPago.EFECTIVO };

    it('debe retornar el pago creado', async () => {
      const mockPago = { id: PAGO_ID, ...dto };
      mockPagosService.create.mockResolvedValue(mockPago);

      const result = await controller.create(dto);
      expect(result).toEqual(mockPago);
    });

    it('debe llamar a pagosService.create con el dto proporcionado', async () => {
      mockPagosService.create.mockResolvedValue({ id: PAGO_ID, ...dto });
      await controller.create(dto);
      expect(mockPagosService.create).toHaveBeenCalledWith(dto);
    });

    it('debe propagar NotFoundException cuando el paciente no existe', async () => {
      mockPagosService.create.mockRejectedValue(new NotFoundException('Paciente no encontrado'));
      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });

  });

  describe('findAll()', () => {

    it('debe retornar la lista de pagos', async () => {
      const mockPagos = [{ id: PAGO_ID, monto: 50 }];
      mockPagosService.findAll.mockResolvedValue(mockPagos);

      const result = await controller.findAll();
      expect(result).toEqual(mockPagos);
    });

    it('debe llamar a pagosService.findAll', async () => {
      mockPagosService.findAll.mockResolvedValue([]);
      await controller.findAll();
      expect(mockPagosService.findAll).toHaveBeenCalled();
    });

  });

  describe('findOne()', () => {

    it('debe retornar el pago cuando existe', async () => {
      const mockPago = { id: PAGO_ID, monto: 50 };
      mockPagosService.findOne.mockResolvedValue(mockPago);

      const result = await controller.findOne(PAGO_ID);
      expect(result).toEqual(mockPago);
    });

    it('debe llamar a pagosService.findOne con el id correcto', async () => {
      mockPagosService.findOne.mockResolvedValue({ id: PAGO_ID });
      await controller.findOne(PAGO_ID);
      expect(mockPagosService.findOne).toHaveBeenCalledWith(PAGO_ID);
    });

    it('debe propagar NotFoundException cuando el pago no existe', async () => {
      mockPagosService.findOne.mockRejectedValue(new NotFoundException('Pago no encontrado'));
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('debe retornar el pago actualizado', async () => {
      const mockPago = { id: PAGO_ID, estado: EstadoPago.COMPLETADO };
      mockPagosService.update.mockResolvedValue(mockPago);

      const result = await controller.update(PAGO_ID, { estado: EstadoPago.COMPLETADO });
      expect(result).toEqual(mockPago);
    });

    it('debe llamar a pagosService.update con el id y el dto correctos', async () => {
      const dto = { estado: EstadoPago.COMPLETADO };
      mockPagosService.update.mockResolvedValue({ id: PAGO_ID, ...dto });
      await controller.update(PAGO_ID, dto);
      expect(mockPagosService.update).toHaveBeenCalledWith(PAGO_ID, dto);
    });

  });

  describe('remove()', () => {

    it('debe retornar el pago eliminado', async () => {
      const mockPago = { id: PAGO_ID, monto: 50 };
      mockPagosService.remove.mockResolvedValue(mockPago);

      const result = await controller.remove(PAGO_ID);
      expect(result).toEqual(mockPago);
    });

    it('debe llamar a pagosService.remove con el id correcto', async () => {
      mockPagosService.remove.mockResolvedValue({ id: PAGO_ID });
      await controller.remove(PAGO_ID);
      expect(mockPagosService.remove).toHaveBeenCalledWith(PAGO_ID);
    });

  });

});
