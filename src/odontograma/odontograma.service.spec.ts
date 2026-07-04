import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OdontogramaService } from './odontograma.service';
import { Odontograma } from './schemas/odontograma.schema';

const ODONTOGRAMA_ID = '6a4025d8ae410bd32b32e659';
const PACIENTE_ID    = '11111111-1111-1111-1111-111111111111';

describe('OdontogramaService', () => {
  let service: OdontogramaService;
  let mockOdontograma: any;
  let mockOdontogramaModel: any;

  beforeEach(async () => {
    mockOdontograma = {
      _id:          ODONTOGRAMA_ID,
      pacienteId:   PACIENTE_ID,
      dientes:      [{ numero: 11, superficies: { vestibular: 'sano', distal: 'caries', lingual: 'sano', mesial: 'sano', oclusal: 'sano' }, estadoGeneral: 'presente', observaciones: '' }],
      fechaEvaluacion: new Date(),
      markModified: jest.fn(),
      save:         jest.fn().mockResolvedValue({ _id: ODONTOGRAMA_ID, pacienteId: PACIENTE_ID }),
      deleteOne:    jest.fn().mockResolvedValue({ _id: ODONTOGRAMA_ID }),
    };

    mockOdontogramaModel = Object.assign(
      jest.fn().mockImplementation(() => mockOdontograma),
      {
        find:        jest.fn(),
        findById:    jest.fn(),
        findByIdAndDelete: jest.fn(),
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OdontogramaService,
        { provide: getModelToken(Odontograma.name), useValue: mockOdontogramaModel },
      ],
    }).compile();

    service = module.get<OdontogramaService>(OdontogramaService);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and return an odontograma', async () => {
      mockOdontograma.save.mockResolvedValue(mockOdontograma);
      const result = await service.create({ pacienteId: PACIENTE_ID, dientes: [] } as any);
      expect(result).toBeDefined();
    });

    it('should return null when save throws', async () => {
      mockOdontograma.save.mockRejectedValue(new Error('DB error'));
      expect(await service.create({ pacienteId: PACIENTE_ID } as any)).toBeNull();
    });
  });

  describe('findOne()', () => {
    it('should return an odontograma when it exists', async () => {
      mockOdontogramaModel.findById.mockResolvedValue(mockOdontograma);
      const result = await service.findOne(ODONTOGRAMA_ID);
      expect(result).toEqual(mockOdontograma);
    });

    it('should return null when odontograma does not exist', async () => {
      mockOdontogramaModel.findById.mockResolvedValue(null);
      expect(await service.findOne(ODONTOGRAMA_ID)).toBeNull();
    });

    it('should return null when findById throws', async () => {
      mockOdontogramaModel.findById.mockRejectedValue(new Error('Cast error'));
      expect(await service.findOne(ODONTOGRAMA_ID)).toBeNull();
    });
  });

  describe('findAll()', () => {
    it('should return paginated odontogramas', async () => {
      const mockItems = [mockOdontograma];
      mockOdontogramaModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockItems),
      });
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toHaveProperty('items');
      expect(result.items).toEqual(mockItems);
    });

    it('should return null when find throws', async () => {
      mockOdontogramaModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('DB error')),
      });
      expect(await service.findAll({ page: 1, limit: 10 })).toBeNull();
    });
  });

  describe('findByPaciente()', () => {
    it('should return odontogramas for the given pacienteId', async () => {
      const mockItems = [mockOdontograma];
      mockOdontogramaModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort:  jest.fn().mockResolvedValue(mockItems),
      });
      const result = await service.findByPaciente(PACIENTE_ID, { page: 1, limit: 10 });
      expect(result).toHaveProperty('items');
      expect(result.items).toEqual(mockItems);
    });

    it('should return null when find throws', async () => {
      mockOdontogramaModel.find.mockReturnValue({
        skip:  jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort:  jest.fn().mockRejectedValue(new Error('DB error')),
      });
      expect(await service.findByPaciente(PACIENTE_ID, { page: 1, limit: 10 })).toBeNull();
    });
  });

  describe('updateDiente()', () => {
    it('should return null when odontograma does not exist', async () => {
      mockOdontogramaModel.findById.mockResolvedValue(null);
      expect(await service.updateDiente(ODONTOGRAMA_ID, { numero: 11, superficies: {} } as any)).toBeNull();
    });

    it('should update superficies of existing diente', async () => {
      mockOdontograma.save = jest.fn().mockResolvedValue(mockOdontograma);
      mockOdontogramaModel.findById.mockResolvedValue(mockOdontograma);
      const result = await service.updateDiente(ODONTOGRAMA_ID, { numero: 11, superficies: { distal: 'obturado' } } as any);
      expect(result).toBeDefined();
    });

    it('should add a new diente when numero does not exist', async () => {
      mockOdontograma.dientes = [];
      mockOdontograma.save = jest.fn().mockResolvedValue(mockOdontograma);
      mockOdontogramaModel.findById.mockResolvedValue(mockOdontograma);
      
      const result = await service.updateDiente(ODONTOGRAMA_ID, { numero: 21, superficies: { vestibular: 'caries' } } as any);
      expect(result).toBeDefined();
      expect(mockOdontograma.dientes.length).toBe(1);
    });

    it('should return null when findById throws', async () => {
      mockOdontogramaModel.findById.mockRejectedValue(new Error('DB error'));
      expect(await service.updateDiente(ODONTOGRAMA_ID, { numero: 11 } as any)).toBeNull();
    });
  });

  describe('remove()', () => {
    it('should return null when odontograma does not exist', async () => {
      mockOdontogramaModel.findById.mockResolvedValue(null);
      expect(await service.remove(ODONTOGRAMA_ID)).toBeNull();
    });

    it('should call deleteOne and return the odontograma', async () => {
      mockOdontograma.deleteOne = jest.fn().mockResolvedValue(mockOdontograma);
      mockOdontogramaModel.findById.mockResolvedValue(mockOdontograma);
      
      const result = await service.remove(ODONTOGRAMA_ID);
      expect(mockOdontograma.deleteOne).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return null when deleteOne throws', async () => {
      mockOdontograma.deleteOne = jest.fn().mockRejectedValue(new Error('DB error'));
      mockOdontogramaModel.findById.mockResolvedValue(mockOdontograma);
      
      expect(await service.remove(ODONTOGRAMA_ID)).toBeNull();
    });
  });
});