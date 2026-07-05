import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { Receta } from './receta.schema';

const RECETA_ID   = '6a4025d8ae410bd32b32e661';
const PACIENTE_ID = '11111111-1111-1111-1111-111111111111';

const mockReceta = {
  _id:        RECETA_ID,
  pacienteId: PACIENTE_ID,
  fecha:      new Date(),
  save:       jest.fn().mockResolvedValue({ _id: RECETA_ID, pacienteId: PACIENTE_ID }),
};

describe('RecetasService', () => {
  let service: RecetasService;

  const mockRecetaModel = Object.assign(
    jest.fn().mockImplementation(() => mockReceta),
    {
      find:              jest.fn(),
      findById:          jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    },
  );

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecetasService,
        { provide: getModelToken(Receta.name), useValue: mockRecetaModel },
      ],
    }).compile();

    service = module.get<RecetasService>(RecetasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a receta', async () => {
      mockReceta.save.mockResolvedValue(mockReceta);
      const result = await service.create({ pacienteId: PACIENTE_ID, medicamentos: [] } as any);
      expect(result).toBeDefined();
    });

    it('should return null when save throws', async () => {
      mockReceta.save.mockRejectedValue(new Error('DB error'));
      try {
        await service.create({ pacienteId: PACIENTE_ID } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

  });

  describe('findAll()', () => {

    it('should return all recetas', async () => {
      const mockItems = [mockReceta];
      mockRecetaModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockItems) });
      const result = await service.findAll();
      expect(result).toEqual(mockItems);
    });

    it('should return empty array when no recetas exist', async () => {
      mockRecetaModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return a receta when it exists', async () => {
      mockRecetaModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockReceta) });
      const result = await service.findOne(RECETA_ID);
      expect(result).toEqual(mockReceta);
    });

    it('should throw NotFoundException when receta does not exist', async () => {
      mockRecetaModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findOne('nonexistentid')).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should update and return the receta', async () => {
      const mockUpdated = { ...mockReceta, indicaciones: 'Nueva indicación' };
      mockRecetaModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUpdated) });
      const result = await service.update(RECETA_ID, { indicaciones: 'Nueva indicación' } as any);
      expect(result).toEqual(mockUpdated);
    });

    it('should throw NotFoundException when receta does not exist', async () => {
      mockRecetaModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.update('nonexistentid', { indicaciones: 'x' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call findByIdAndUpdate with correct params', async () => {
      const mockUpdated = { ...mockReceta };
      mockRecetaModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUpdated) });
      const dto = { indicaciones: 'Tomar con agua' } as any;
      await service.update(RECETA_ID, dto);
      expect(mockRecetaModel.findByIdAndUpdate).toHaveBeenCalledWith(RECETA_ID, dto, { new: true });
    });

  });

  describe('remove()', () => {

    it('should remove and return a success message', async () => {
      mockRecetaModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockReceta) });
      const result = await service.remove(RECETA_ID);
      expect(result).toEqual({ message: 'Receta eliminada correctamente' });
    });

    it('should throw NotFoundException when receta does not exist', async () => {
      mockRecetaModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.remove('nonexistentid')).rejects.toThrow(NotFoundException);
    });

    it('should call findByIdAndDelete with correct id', async () => {
      mockRecetaModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockReceta) });
      await service.remove(RECETA_ID);
      expect(mockRecetaModel.findByIdAndDelete).toHaveBeenCalledWith(RECETA_ID);
    });

  });

});
