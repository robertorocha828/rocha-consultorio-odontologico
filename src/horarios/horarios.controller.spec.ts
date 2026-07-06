import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';
import { DiaSemana } from './horario.entity';

const HORARIO_ID   = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('HorariosController', () => {
  let controller: HorariosController;

  const mockHorariosService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorariosController],
      providers: [
        { provide: HorariosService, useValue: mockHorariosService },
      ],
    }).compile();

    controller = module.get<HorariosController>(HorariosController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('debe retornar SuccessResponseDto con el horario creado', async () => {
      const dto = { dia: DiaSemana.LUNES, horaInicio: '08:00', horaFin: '12:00' };
      const mockHorario = { id: HORARIO_ID, ...dto };
      mockHorariosService.create.mockResolvedValue(mockHorario);

      const result = await controller.create(dto);
      expect(result).toEqual({ success: true, message: 'Horario creado exitosamente', data: mockHorario });
    });

    it('debe lanzar InternalServerErrorException cuando el service retorna null', async () => {
      mockHorariosService.create.mockResolvedValue(null);
      await expect(controller.create({ dia: DiaSemana.LUNES, horaInicio: '08:00', horaFin: '12:00' }))
        .rejects.toThrow(InternalServerErrorException);
    });

    it('debe llamar a horariosService.create con el dto proporcionado', async () => {
      const dto = { dia: DiaSemana.MARTES, horaInicio: '09:00', horaFin: '13:00' };
      mockHorariosService.create.mockResolvedValue({ id: HORARIO_ID, ...dto });
      await controller.create(dto);
      expect(mockHorariosService.create).toHaveBeenCalledWith(dto);
    });

  });

  describe('findAll()', () => {

    const mockPagination = {
      items: [{ id: HORARIO_ID, dia: DiaSemana.LUNES }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('debe retornar SuccessResponseDto con los horarios paginados', async () => {
      mockHorariosService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPagination);
    });

    it('debe lanzar InternalServerErrorException cuando el service retorna null', async () => {
      mockHorariosService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any))
        .rejects.toThrow(InternalServerErrorException);
    });

    it('debe limitar el limit a 100 cuando excede 100', async () => {
      mockHorariosService.findAll.mockResolvedValue(mockPagination);
      const query = { page: 1, limit: 200 } as any;
      await controller.findAll(query);
      expect(mockHorariosService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
      );
    });

  });

  describe('findOne()', () => {

    it('debe retornar SuccessResponseDto cuando el horario existe', async () => {
      const mockHorario = { id: HORARIO_ID, dia: DiaSemana.LUNES };
      mockHorariosService.findOne.mockResolvedValue(mockHorario);

      const result = await controller.findOne(HORARIO_ID);
      expect(result).toEqual({ success: true, message: 'Horario obtenido exitosamente', data: mockHorario });
    });

    it('debe lanzar NotFoundException cuando el horario no existe', async () => {
      mockHorariosService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException con el mensaje correcto', async () => {
      mockHorariosService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow('Horario no encontrado');
    });

    it('debe llamar a horariosService.findOne con el id correcto', async () => {
      mockHorariosService.findOne.mockResolvedValue({ id: HORARIO_ID });
      await controller.findOne(HORARIO_ID);
      expect(mockHorariosService.findOne).toHaveBeenCalledWith(HORARIO_ID);
    });

  });

  describe('update()', () => {

    it('debe retornar SuccessResponseDto con el horario actualizado', async () => {
      const mockHorario = { id: HORARIO_ID, horaInicio: '10:00' };
      mockHorariosService.update.mockResolvedValue(mockHorario);

      const result = await controller.update(HORARIO_ID, { horaInicio: '10:00' });
      expect(result).toEqual({ success: true, message: 'Horario actualizado exitosamente', data: mockHorario });
    });

    it('debe lanzar NotFoundException cuando el horario no existe', async () => {
      mockHorariosService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { horaInicio: '10:00' }))
        .rejects.toThrow(NotFoundException);
    });

  });

  describe('remove()', () => {

    it('debe retornar SuccessResponseDto cuando el horario se elimina', async () => {
      const mockHorario = { id: HORARIO_ID, dia: DiaSemana.LUNES };
      mockHorariosService.remove.mockResolvedValue(mockHorario);

      const result = await controller.remove(HORARIO_ID);
      expect(result).toEqual({ success: true, message: 'Horario eliminado exitosamente', data: mockHorario });
    });

    it('debe lanzar NotFoundException cuando el horario no existe', async () => {
      mockHorariosService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

});
