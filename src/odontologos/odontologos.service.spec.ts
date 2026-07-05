import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { OdontologosService } from './odontologos.service';
import { Odontologo } from './odontologo.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

const mockPaginate = paginate as jest.Mock;
const ODONTOLOGO_ID = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID  = '99999999-9999-9999-9999-999999999999';

describe('OdontologosService', () => {
  let service: OdontologosService;

  const mockQueryBuilder = {
    where:   jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockRepo = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OdontologosService,
        { provide: getRepositoryToken(Odontologo), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<OdontologosService>(OdontologosService);
  });

  it('debe estar definido', () => expect(service).toBeDefined());

  describe('create()', () => {
    const dto = { cedula: '1234567890', nombre: 'Maria', apellido: 'Lopez', telefono: '0981234567', especialidad: 'ortodoncia', numeroRegistro: 'REG-001' };

    it('debe crear y retornar un odontólogo', async () => {
      const mock = { id: ODONTOLOGO_ID, ...dto };
      mockRepo.create.mockReturnValue(mock);
      mockRepo.save.mockResolvedValue(mock);
      expect(await service.create(dto)).toEqual(mock);
    });

    it('debe retornar null cuando falla', async () => {
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockRejectedValue(new Error('DB error'));
      expect(await service.create(dto)).toBeNull();
    });
  });

  describe('findAll()', () => {
    const mockResult = { items: [{ id: ODONTOLOGO_ID }], meta: {} };

    it('debe retornar odontólogos paginados', async () => {
      mockPaginate.mockResolvedValue(mockResult);
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toEqual(mockResult);
    });

    it('debe retornar null cuando falla', async () => {
      mockPaginate.mockRejectedValue(new Error('DB timeout'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });
  });

  describe('findOne()', () => {
    it('debe retornar un odontólogo cuando existe', async () => {
      const mock = { id: ODONTOLOGO_ID };
      mockRepo.findOne.mockResolvedValue(mock);
      expect(await service.findOne(ODONTOLOGO_ID)).toEqual(mock);
    });

    it('debe retornar null cuando no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });
  });

  describe('findByCedula()', () => {
    it('debe retornar un odontólogo cuando existe', async () => {
      const mock = { id: ODONTOLOGO_ID, cedula: '1234567890' };
      mockRepo.findOne.mockResolvedValue(mock);
      expect(await service.findByCedula('1234567890')).toEqual(mock);
    });

    it('debe retornar null cuando no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      expect(await service.findByCedula('0000000000')).toBeNull();
    });
  });

  describe('update()', () => {
    it('debe actualizar y retornar el odontólogo', async () => {
      const mock = { id: ODONTOLOGO_ID, nombre: 'Nuevo' };
      mockRepo.findOne.mockResolvedValue({ id: ODONTOLOGO_ID, nombre: 'Viejo' });
      mockRepo.save.mockResolvedValue(mock);
      expect(await service.update(ODONTOLOGO_ID, { nombre: 'Nuevo' })).toEqual(mock);
    });

    it('debe retornar null cuando no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { nombre: 'x' })).toBeNull();
    });
  });

  describe('remove()', () => {
    it('debe eliminar y retornar el odontólogo', async () => {
      const mock = { id: ODONTOLOGO_ID };
      mockRepo.findOne.mockResolvedValue(mock);
      mockRepo.remove.mockResolvedValue(mock);
      expect(await service.remove(ODONTOLOGO_ID)).toEqual(mock);
    });

    it('debe retornar null cuando no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });
  });
});