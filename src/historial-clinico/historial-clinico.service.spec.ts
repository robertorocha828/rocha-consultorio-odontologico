import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HistorialClinicoService } from './historial-clinico.service';
import { HistorialClinico } from './schemas/historial-clinico.schema';

const HISTORIAL_ID = '6a4025d8ae410bd32b32e660';
const PACIENTE_ID  = '11111111-1111-1111-1111-111111111111';

const mockHistorial = {
  _id:            HISTORIAL_ID,
  pacienteId:     PACIENTE_ID,
  motivoConsulta: 'Dolor muela',
  diagnostico:    'Pericoronitis leve',
  markModified:   jest.fn(),
  save:           jest.fn().mockResolvedValue({ _id: HISTORIAL_ID, pacienteId: PACIENTE_ID }),
  deleteOne:      jest.fn().mockResolvedValue({ _id: HISTORIAL_ID }),
};

describe('HistorialClinicoService', () => {
  let service: HistorialClinicoService;

  const mockHistorialModel = Object.assign(
    jest.fn().mockImplementation(() => mockHistorial),
    {
      find:     jest.fn(),
      findById: jest.fn(),
    },
  );

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistorialClinicoService,
        { provide: getModelToken(HistorialClinico.name), useValue: mockHistorialModel },
      ],
    }).compile();

    service = module.get<HistorialClinicoService>(HistorialClinicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a historial', async () => {
      mockHistorial.save.mockResolvedValue(mockHistorial);
      const result = await service.create({ pacienteId: PACIENTE_ID, motivoConsulta: 'Dolor' } as any);
      expect(result).toBeDefined();
    });

    it('should return null when save throws', async () => {
      mockHistorial.save.mockRejectedValue(new Error('DB error'));
      expect(await service.create({ pacienteId: PACIENTE_ID } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('should return a historial when it exists', async () => {
      mockHistorialModel.findById.mockResolvedValue(mockHistorial);
      const result = await service.findOne(HISTORIAL_ID);
      expect(result).toEqual(mockHistorial);
    });

    it('should return null when historial does not exist', async () => {
      mockHistorialModel.findById.mockResolvedValue(null);
      expect(await service.findOne('nonexistentid')).toBeNull();
    });

    it('should return null when findById throws', async () => {
      mockHistorialModel.findById.mockRejectedValue(new Error('Cast error'));
      expect(await service.findOne('invalidid')).toBeNull();
    });

  });

  describe('findAll()', () => {

    it('should return paginated historiales', async () => {
      const mockItems = [mockHistorial];
      mockHistorialModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort:  jest.fn().mockResolvedValue(mockItems),
      });
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('page', 1);
    });

    it('should return null when find throws', async () => {
      mockHistorialModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort:  jest.fn().mockRejectedValue(new Error('DB error')),
      });
      expect(await service.findAll({ page: 1, limit: 10 })).toBeNull();
    });

  });

  describe('findByPaciente()', () => {

    it('should return historiales for the given pacienteId', async () => {
      const mockItems = [mockHistorial];
      mockHistorialModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort:  jest.fn().mockResolvedValue(mockItems),
      });
      const result = await service.findByPaciente(PACIENTE_ID, { page: 1, limit: 10 });
      expect(result).toHaveProperty('items');
    });

    it('should return null when find throws', async () => {
      mockHistorialModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort:  jest.fn().mockRejectedValue(new Error('DB error')),
      });
      expect(await service.findByPaciente(PACIENTE_ID, { page: 1, limit: 10 })).toBeNull();
    });

  });

  describe('update()', () => {

    it('should return null when historial does not exist', async () => {
      mockHistorialModel.findById.mockResolvedValue(null);
      expect(await service.update('nonexistentid', { diagnostico: 'Nuevo' } as any)).toBeNull();
    });

    it('should update and return the historial', async () => {
      const mockDoc = { ...mockHistorial, markModified: jest.fn(), save: jest.fn().mockResolvedValue(mockHistorial) };
      mockHistorialModel.findById.mockResolvedValue(mockDoc);
      const result = await service.update(HISTORIAL_ID, { diagnostico: 'Actualizado' } as any);
      expect(result).toBeDefined();
    });

    it('should return null when save throws', async () => {
      const mockDoc = { ...mockHistorial, markModified: jest.fn(), save: jest.fn().mockRejectedValue(new Error('Save error')) };
      mockHistorialModel.findById.mockResolvedValue(mockDoc);
      expect(await service.update(HISTORIAL_ID, { diagnostico: 'x' } as any)).toBeNull();
    });

  });

  describe('remove()', () => {

    it('should return null when historial does not exist', async () => {
      mockHistorialModel.findById.mockResolvedValue(null);
      expect(await service.remove('nonexistentid')).toBeNull();
    });

    it('should call deleteOne and return the historial', async () => {
      const mockDoc = { ...mockHistorial, deleteOne: jest.fn().mockResolvedValue(mockHistorial) };
      mockHistorialModel.findById.mockResolvedValue(mockDoc);
      const result = await service.remove(HISTORIAL_ID);
      expect(mockDoc.deleteOne).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return null when deleteOne throws', async () => {
      const mockDoc = { ...mockHistorial, deleteOne: jest.fn().mockRejectedValue(new Error('DB error')) };
      mockHistorialModel.findById.mockResolvedValue(mockDoc);
      expect(await service.remove(HISTORIAL_ID)).toBeNull();
    });

  });

});
