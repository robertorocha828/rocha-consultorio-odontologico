import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { Pago, MetodoPago, EstadoPago } from './pago.entity';
import { Paciente } from '../pacientes/paciente.entity';

const PAGO_ID       = '11111111-1111-1111-1111-111111111111';
const PACIENTE_ID   = '33333333-3333-3333-3333-333333333333';
const NOT_FOUND_ID  = '99999999-9999-9999-9999-999999999999';

describe('PagosService', () => {
  let service: PagosService;

  const mockPagoRepository = {
    create:  jest.fn(),
    save:    jest.fn(),
    find:    jest.fn(),
    findOne: jest.fn(),
    remove:  jest.fn(),
  };

  const mockPacienteRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        { provide: getRepositoryToken(Pago),     useValue: mockPagoRepository },
        { provide: getRepositoryToken(Paciente), useValue: mockPacienteRepository },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    const dto = { pacienteId: PACIENTE_ID, monto: 50, metodoPago: MetodoPago.EFECTIVO, observaciones: 'Consulta' };

    it('debe lanzar NotFoundException cuando el paciente no existe', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('debe crear y retornar un pago cuando el paciente existe', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      const mockPago = { id: PAGO_ID, monto: dto.monto, metodoPago: dto.metodoPago, paciente: mockPaciente };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPagoRepository.create.mockReturnValue(mockPago);
      mockPagoRepository.save.mockResolvedValue(mockPago);

      const result = await service.create(dto);
      expect(result).toEqual(mockPago);
    });

    it('debe llamar a pacienteRepository.findOne con el pacienteId correcto', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(mockPacienteRepository.findOne).toHaveBeenCalledWith({ where: { id: PACIENTE_ID } });
    });

    it('debe llamar a pagoRepository.create con los datos correctos', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPagoRepository.create.mockReturnValue({});
      mockPagoRepository.save.mockResolvedValue({});

      await service.create(dto);
      expect(mockPagoRepository.create).toHaveBeenCalledWith({
        monto: dto.monto,
        metodoPago: dto.metodoPago,
        observaciones: dto.observaciones,
        paciente: mockPaciente,
      });
    });

  });

  describe('findAll()', () => {

    it('debe retornar los pagos con la relación paciente', async () => {
      const mockPagos = [{ id: PAGO_ID, monto: 50, paciente: { id: PACIENTE_ID } }];
      mockPagoRepository.find.mockResolvedValue(mockPagos);

      const result = await service.findAll();
      expect(result).toEqual(mockPagos);
    });

    it('debe llamar a find con la relación paciente', async () => {
      mockPagoRepository.find.mockResolvedValue([]);
      await service.findAll();
      expect(mockPagoRepository.find).toHaveBeenCalledWith({ relations: { paciente: true } });
    });

  });

  describe('findOne()', () => {

    it('debe retornar un pago cuando existe', async () => {
      const mockPago = { id: PAGO_ID, monto: 50, paciente: { id: PACIENTE_ID } };
      mockPagoRepository.findOne.mockResolvedValue(mockPago);
      expect(await service.findOne(PAGO_ID)).toEqual(mockPago);
    });

    it('debe lanzar NotFoundException cuando el pago no existe', async () => {
      mockPagoRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('debe llamar a findOne con el id correcto y la relación paciente', async () => {
      mockPagoRepository.findOne.mockResolvedValue({ id: PAGO_ID });
      await service.findOne(PAGO_ID);
      expect(mockPagoRepository.findOne).toHaveBeenCalledWith({
        where: { id: PAGO_ID },
        relations: { paciente: true },
      });
    });

  });

  describe('update()', () => {

    it('debe lanzar NotFoundException cuando el pago no existe', async () => {
      mockPagoRepository.findOne.mockResolvedValue(null);
      await expect(service.update(NOT_FOUND_ID, { estado: EstadoPago.COMPLETADO }))
        .rejects.toThrow(NotFoundException);
    });

    it('debe actualizar y retornar el pago', async () => {
      const mockPago  = { id: PAGO_ID, estado: EstadoPago.PENDIENTE };
      const savedPago = { id: PAGO_ID, estado: EstadoPago.COMPLETADO };
      mockPagoRepository.findOne.mockResolvedValue({ ...mockPago });
      mockPagoRepository.save.mockResolvedValue(savedPago);

      const result = await service.update(PAGO_ID, { estado: EstadoPago.COMPLETADO });
      expect(result).toEqual(savedPago);
    });

  });

  describe('remove()', () => {

    it('debe lanzar NotFoundException cuando el pago no existe', async () => {
      mockPagoRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('debe eliminar y retornar el pago', async () => {
      const mockPago = { id: PAGO_ID, monto: 50 };
      mockPagoRepository.findOne.mockResolvedValue(mockPago);
      mockPagoRepository.remove.mockResolvedValue(mockPago);

      expect(await service.remove(PAGO_ID)).toEqual(mockPago);
    });

  });

});
