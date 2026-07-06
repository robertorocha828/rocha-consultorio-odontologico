import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { HorariosService } from './horarios.service';
import { Horario, DiaSemana } from './horario.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

const mockPaginate = paginate as jest.Mock;

const HORARIO_ID   = '11111111-1111-1111-1111-111111111111';
const HORARIO_ID_2 = '22222222-2222-2222-2222-222222222222';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('HorariosService', () => {
  let service: HorariosService;

  const mockQueryBuilder = {
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockHorarioRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockHorarioRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.orderBy.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HorariosService,
        { provide: getRepositoryToken(Horario), useValue: mockHorarioRepository },
      ],
    }).compile();

    service = module.get<HorariosService>(HorariosService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('debe crear y retornar un horario', async () => {
      const dto = { dia: DiaSemana.LUNES, horaInicio: '08:00', horaFin: '12:00' };
      const mockHorario = { id: HORARIO_ID, ...dto };
      mockHorarioRepository.create.mockReturnValue(mockHorario);
      mockHorarioRepository.save.mockResolvedValue(mockHorario);

      const result = await service.create(dto);
      expect(result).toEqual(mockHorario);
    });

    it('debe llamar a horarioRepo.create con el dto proporcionado', async () => {
      const dto = { dia: DiaSemana.MARTES, horaInicio: '09:00', horaFin: '13:00' };
      mockHorarioRepository.create.mockReturnValue(dto);
      mockHorarioRepository.save.mockResolvedValue({ id: HORARIO_ID, ...dto });

      await service.create(dto);
      expect(mockHorarioRepository.create).toHaveBeenCalledWith(dto);
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockHorarioRepository.create.mockReturnValue({});
      mockHorarioRepository.save.mockRejectedValue(new Error('DB error'));
      expect(await service.create({ dia: DiaSemana.LUNES, horaInicio: '08:00', horaFin: '12:00' })).toBeNull();
    });

  });

  describe('findAll()', () => {

    const mockPaginationResult = {
      items: [
        { id: HORARIO_ID,   dia: DiaSemana.LUNES },
        { id: HORARIO_ID_2, dia: DiaSemana.MARTES },
      ],
      meta: { itemCount: 2, totalItems: 2, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
    };

    it('debe retornar horarios paginados sin filtros', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      const result = await service.findAll({ page: 1, limit: 10 } as any);
      expect(result).toEqual(mockPaginationResult);
    });

    it('debe llamar a createQueryBuilder con el alias "horario"', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockHorarioRepository.createQueryBuilder).toHaveBeenCalledWith('horario');
    });

    it('debe llamar a orderBy cuando se proporciona sort', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, sort: 'dia', order: 'ASC' } as any);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('horario.dia', 'ASC');
    });

    it('no debe llamar a orderBy cuando no se proporciona sort', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockQueryBuilder.orderBy).not.toHaveBeenCalled();
    });

    it('debe pasar page y limit a paginate', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 2, limit: 5 } as any);
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, { page: 2, limit: 5 });
    });

    it('debe retornar null cuando paginate lanza un error', async () => {
      mockPaginate.mockRejectedValue(new Error('DB timeout'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('debe retornar un horario cuando existe', async () => {
      const mockHorario = { id: HORARIO_ID, dia: DiaSemana.LUNES };
      mockHorarioRepository.findOne.mockResolvedValue(mockHorario);
      expect(await service.findOne(HORARIO_ID)).toEqual(mockHorario);
    });

    it('debe retornar null cuando el horario no existe', async () => {
      mockHorarioRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });

    it('debe llamar a findOne con el id correcto', async () => {
      mockHorarioRepository.findOne.mockResolvedValue(null);
      await service.findOne(HORARIO_ID);
      expect(mockHorarioRepository.findOne).toHaveBeenCalledWith({ where: { id: HORARIO_ID } });
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockHorarioRepository.findOne.mockRejectedValue(new Error('Timeout'));
      expect(await service.findOne(HORARIO_ID)).toBeNull();
    });

  });

  describe('update()', () => {

    it('debe retornar null cuando el horario no existe', async () => {
      mockHorarioRepository.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { horaInicio: '10:00' })).toBeNull();
    });

    it('debe actualizar y retornar el horario', async () => {
      const mockHorario   = { id: HORARIO_ID, horaInicio: '08:00', horaFin: '12:00' };
      const savedHorario  = { id: HORARIO_ID, horaInicio: '10:00', horaFin: '12:00' };
      mockHorarioRepository.findOne.mockResolvedValue({ ...mockHorario });
      mockHorarioRepository.save.mockResolvedValue(savedHorario);

      const result = await service.update(HORARIO_ID, { horaInicio: '10:00' });
      expect(result).toEqual(savedHorario);
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockHorarioRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.update(HORARIO_ID, { horaInicio: '10:00' })).toBeNull();
    });

  });

  describe('remove()', () => {

    it('debe retornar null cuando el horario no existe', async () => {
      mockHorarioRepository.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });

    it('debe eliminar y retornar el horario', async () => {
      const mockHorario = { id: HORARIO_ID, dia: DiaSemana.LUNES };
      mockHorarioRepository.findOne.mockResolvedValue(mockHorario);
      mockHorarioRepository.remove.mockResolvedValue(mockHorario);

      expect(await service.remove(HORARIO_ID)).toEqual(mockHorario);
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockHorarioRepository.findOne.mockResolvedValue({ id: HORARIO_ID });
      mockHorarioRepository.remove.mockRejectedValue(new Error('FK constraint'));
      expect(await service.remove(HORARIO_ID)).toBeNull();
    });

  });

});
