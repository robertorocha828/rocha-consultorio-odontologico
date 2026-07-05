import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { Factura, EstadoFactura } from './factura.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { Pago } from '../pagos/pago.entity';

const FACTURA_ID    = '11111111-1111-1111-1111-111111111111';
const PACIENTE_ID    = '33333333-3333-3333-3333-333333333333';
const PAGO_ID        = '44444444-4444-4444-4444-444444444444';
const NOT_FOUND_ID   = '99999999-9999-9999-9999-999999999999';

describe('FacturasService', () => {
  let service: FacturasService;

  const mockFacturaRepository = {
    create:  jest.fn(),
    save:    jest.fn(),
    find:    jest.fn(),
    findOne: jest.fn(),
    remove:  jest.fn(),
  };

  const mockPacienteRepository = {
    findOne: jest.fn(),
  };

  const mockPagoRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturasService,
        { provide: getRepositoryToken(Factura),  useValue: mockFacturaRepository },
        { provide: getRepositoryToken(Paciente),  useValue: mockPacienteRepository },
        { provide: getRepositoryToken(Pago),      useValue: mockPagoRepository },
      ],
    }).compile();

    service = module.get<FacturasService>(FacturasService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    const dto = { numero: 'F-001', pacienteId: PACIENTE_ID, subtotal: 100, total: 112 };

    it('debe lanzar NotFoundException cuando el paciente no existe', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException cuando se proporciona pagoId pero el pago no existe', async () => {
      mockPacienteRepository.findOne.mockResolvedValue({ id: PACIENTE_ID });
      mockPagoRepository.findOne.mockResolvedValue(null);
      await expect(service.create({ ...dto, pagoId: NOT_FOUND_ID })).rejects.toThrow(NotFoundException);
    });

    it('debe crear una factura sin pago cuando no se proporciona pagoId', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      const mockFactura = { id: FACTURA_ID, ...dto, paciente: mockPaciente, pago: undefined };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockFacturaRepository.create.mockReturnValue(mockFactura);
      mockFacturaRepository.save.mockResolvedValue(mockFactura);

      const result = await service.create(dto);
      expect(result).toEqual(mockFactura);
      expect(mockPagoRepository.findOne).not.toHaveBeenCalled();
    });

    it('debe crear una factura con pago cuando se proporciona pagoId y existe', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      const mockPago = { id: PAGO_ID, monto: 100 };
      const mockFactura = { id: FACTURA_ID, ...dto, paciente: mockPaciente, pago: mockPago };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPagoRepository.findOne.mockResolvedValue(mockPago);
      mockFacturaRepository.create.mockReturnValue(mockFactura);
      mockFacturaRepository.save.mockResolvedValue(mockFactura);

      const result = await service.create({ ...dto, pagoId: PAGO_ID });
      expect(result).toEqual(mockFactura);
    });

    it('debe llamar a facturaRepository.create con los datos correctos', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockFacturaRepository.create.mockReturnValue({});
      mockFacturaRepository.save.mockResolvedValue({});

      await service.create(dto);
      expect(mockFacturaRepository.create).toHaveBeenCalledWith({
        numero: dto.numero,
        subtotal: dto.subtotal,
        total: dto.total,
        observaciones: dto.observaciones,
        paciente: mockPaciente,
        pago: undefined,
      });
    });

  });

  describe('findAll()', () => {

    it('debe retornar las facturas con las relaciones paciente y pago', async () => {
      const mockFacturas = [{ id: FACTURA_ID, numero: 'F-001' }];
      mockFacturaRepository.find.mockResolvedValue(mockFacturas);

      const result = await service.findAll();
      expect(result).toEqual(mockFacturas);
    });

    it('debe llamar a find con las relaciones paciente y pago', async () => {
      mockFacturaRepository.find.mockResolvedValue([]);
      await service.findAll();
      expect(mockFacturaRepository.find).toHaveBeenCalledWith({ relations: { paciente: true, pago: true } });
    });

  });

  describe('findOne()', () => {

    it('debe retornar una factura cuando existe', async () => {
      const mockFactura = { id: FACTURA_ID, numero: 'F-001' };
      mockFacturaRepository.findOne.mockResolvedValue(mockFactura);
      expect(await service.findOne(FACTURA_ID)).toEqual(mockFactura);
    });

    it('debe lanzar NotFoundException cuando la factura no existe', async () => {
      mockFacturaRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('debe llamar a findOne con el id correcto y las relaciones', async () => {
      mockFacturaRepository.findOne.mockResolvedValue({ id: FACTURA_ID });
      await service.findOne(FACTURA_ID);
      expect(mockFacturaRepository.findOne).toHaveBeenCalledWith({
        where: { id: FACTURA_ID },
        relations: { paciente: true, pago: true },
      });
    });

  });

  describe('update()', () => {

    it('debe lanzar NotFoundException cuando la factura no existe', async () => {
      mockFacturaRepository.findOne.mockResolvedValue(null);
      await expect(service.update(NOT_FOUND_ID, { estado: EstadoFactura.PAGADA }))
        .rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException cuando el nuevo pagoId no existe', async () => {
      mockFacturaRepository.findOne.mockResolvedValue({ id: FACTURA_ID });
      mockPagoRepository.findOne.mockResolvedValue(null);
      await expect(service.update(FACTURA_ID, { pagoId: NOT_FOUND_ID })).rejects.toThrow(NotFoundException);
    });

    it('debe actualizar la relación pago cuando se proporciona un pagoId válido', async () => {
      const mockFactura = { id: FACTURA_ID, estado: EstadoFactura.PENDIENTE };
      const mockPago    = { id: PAGO_ID, monto: 100 };
      const savedFactura = { ...mockFactura, pago: mockPago };
      mockFacturaRepository.findOne.mockResolvedValue({ ...mockFactura });
      mockPagoRepository.findOne.mockResolvedValue(mockPago);
      mockFacturaRepository.save.mockResolvedValue(savedFactura);

      const result = await service.update(FACTURA_ID, { pagoId: PAGO_ID });
      expect(result).toEqual(savedFactura);
    });

    it('debe actualizar y retornar la factura cuando no se proporciona pagoId', async () => {
      const mockFactura  = { id: FACTURA_ID, estado: EstadoFactura.PENDIENTE };
      const savedFactura = { id: FACTURA_ID, estado: EstadoFactura.PAGADA };
      mockFacturaRepository.findOne.mockResolvedValue({ ...mockFactura });
      mockFacturaRepository.save.mockResolvedValue(savedFactura);

      const result = await service.update(FACTURA_ID, { estado: EstadoFactura.PAGADA });
      expect(result).toEqual(savedFactura);
    });

  });

  describe('remove()', () => {

    it('debe lanzar NotFoundException cuando la factura no existe', async () => {
      mockFacturaRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('debe eliminar y retornar la factura', async () => {
      const mockFactura = { id: FACTURA_ID, numero: 'F-001' };
      mockFacturaRepository.findOne.mockResolvedValue(mockFactura);
      mockFacturaRepository.remove.mockResolvedValue(mockFactura);

      expect(await service.remove(FACTURA_ID)).toEqual(mockFactura);
    });

  });

});
