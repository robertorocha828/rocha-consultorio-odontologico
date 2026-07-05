import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { EstadoFactura } from './factura.entity';

const FACTURA_ID   = '11111111-1111-1111-1111-111111111111';
const PACIENTE_ID  = '33333333-3333-3333-3333-333333333333';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('FacturasController', () => {
  let controller: FacturasController;

  const mockFacturasService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturasController],
      providers: [
        { provide: FacturasService, useValue: mockFacturasService },
      ],
    }).compile();

    controller = module.get<FacturasController>(FacturasController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    const dto = { numero: 'F-001', pacienteId: PACIENTE_ID, subtotal: 100, total: 112 };

    it('debe retornar la factura creada', async () => {
      const mockFactura = { id: FACTURA_ID, ...dto };
      mockFacturasService.create.mockResolvedValue(mockFactura);

      const result = await controller.create(dto);
      expect(result).toEqual(mockFactura);
    });

    it('debe llamar a facturasService.create con el dto proporcionado', async () => {
      mockFacturasService.create.mockResolvedValue({ id: FACTURA_ID, ...dto });
      await controller.create(dto);
      expect(mockFacturasService.create).toHaveBeenCalledWith(dto);
    });

    it('debe propagar NotFoundException cuando el paciente no existe', async () => {
      mockFacturasService.create.mockRejectedValue(new NotFoundException('Paciente no encontrado'));
      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });

  });

  describe('findAll()', () => {

    it('debe retornar la lista de facturas', async () => {
      const mockFacturas = [{ id: FACTURA_ID, numero: 'F-001' }];
      mockFacturasService.findAll.mockResolvedValue(mockFacturas);

      const result = await controller.findAll();
      expect(result).toEqual(mockFacturas);
    });

    it('debe llamar a facturasService.findAll', async () => {
      mockFacturasService.findAll.mockResolvedValue([]);
      await controller.findAll();
      expect(mockFacturasService.findAll).toHaveBeenCalled();
    });

  });

  describe('findOne()', () => {

    it('debe retornar la factura cuando existe', async () => {
      const mockFactura = { id: FACTURA_ID, numero: 'F-001' };
      mockFacturasService.findOne.mockResolvedValue(mockFactura);

      const result = await controller.findOne(FACTURA_ID);
      expect(result).toEqual(mockFactura);
    });

    it('debe llamar a facturasService.findOne con el id correcto', async () => {
      mockFacturasService.findOne.mockResolvedValue({ id: FACTURA_ID });
      await controller.findOne(FACTURA_ID);
      expect(mockFacturasService.findOne).toHaveBeenCalledWith(FACTURA_ID);
    });

    it('debe propagar NotFoundException cuando la factura no existe', async () => {
      mockFacturasService.findOne.mockRejectedValue(new NotFoundException('Factura no encontrada'));
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('debe retornar la factura actualizada', async () => {
      const mockFactura = { id: FACTURA_ID, estado: EstadoFactura.PAGADA };
      mockFacturasService.update.mockResolvedValue(mockFactura);

      const result = await controller.update(FACTURA_ID, { estado: EstadoFactura.PAGADA });
      expect(result).toEqual(mockFactura);
    });

    it('debe llamar a facturasService.update con el id y el dto correctos', async () => {
      const dto = { estado: EstadoFactura.PAGADA };
      mockFacturasService.update.mockResolvedValue({ id: FACTURA_ID, ...dto });
      await controller.update(FACTURA_ID, dto);
      expect(mockFacturasService.update).toHaveBeenCalledWith(FACTURA_ID, dto);
    });

  });

  describe('remove()', () => {

    it('debe retornar la factura eliminada', async () => {
      const mockFactura = { id: FACTURA_ID, numero: 'F-001' };
      mockFacturasService.remove.mockResolvedValue(mockFactura);

      const result = await controller.remove(FACTURA_ID);
      expect(result).toEqual(mockFactura);
    });

    it('debe llamar a facturasService.remove con el id correcto', async () => {
      mockFacturasService.remove.mockResolvedValue({ id: FACTURA_ID });
      await controller.remove(FACTURA_ID);
      expect(mockFacturasService.remove).toHaveBeenCalledWith(FACTURA_ID);
    });

  });

});
