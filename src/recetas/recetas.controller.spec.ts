import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecetasController } from './recetas.controller';
import { RecetasService } from './recetas.service';

const RECETA_ID = '6a4025d8ae410bd32b32e661';

describe('RecetasController', () => {
  let controller: RecetasController;

  const mockRecetasService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecetasController],
      providers: [
        { provide: RecetasService, useValue: mockRecetasService },
      ],
    }).compile();

    controller = module.get<RecetasController>(RecetasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return the created receta', async () => {
      const mockReceta = { _id: RECETA_ID, pacienteId: 'pac-id', medicamentos: [] };
      mockRecetasService.create.mockResolvedValue(mockReceta);
      const result = await controller.create({ pacienteId: 'pac-id', medicamentos: [] } as any);
      expect(result).toEqual(mockReceta);
    });

    it('should call service.create with the provided dto', async () => {
      const dto = { pacienteId: 'pac-id', medicamentos: [] } as any;
      mockRecetasService.create.mockResolvedValue({ _id: RECETA_ID, ...dto });
      await controller.create(dto);
      expect(mockRecetasService.create).toHaveBeenCalledWith(dto);
    });

  });

  describe('findAll()', () => {

    it('should return all recetas', async () => {
      const mockList = [{ _id: RECETA_ID, pacienteId: 'pac-id' }];
      mockRecetasService.findAll.mockResolvedValue(mockList);
      expect(await controller.findAll()).toEqual(mockList);
    });

    it('should return empty array when no recetas exist', async () => {
      mockRecetasService.findAll.mockResolvedValue([]);
      expect(await controller.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return the receta when it exists', async () => {
      const mockReceta = { _id: RECETA_ID, pacienteId: 'pac-id' };
      mockRecetasService.findOne.mockResolvedValue(mockReceta);
      expect(await controller.findOne(RECETA_ID)).toEqual(mockReceta);
    });

    it('should propagate NotFoundException when receta does not exist', async () => {
      mockRecetasService.findOne.mockRejectedValue(new NotFoundException('Receta no encontrada'));
      await expect(controller.findOne('nonexistentid')).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return the updated receta', async () => {
      const mockReceta = { _id: RECETA_ID, indicaciones: 'Nueva indicación' };
      mockRecetasService.update.mockResolvedValue(mockReceta);
      const result = await controller.update(RECETA_ID, { indicaciones: 'Nueva indicación' } as any);
      expect(result).toEqual(mockReceta);
    });

    it('should propagate NotFoundException when receta does not exist', async () => {
      mockRecetasService.update.mockRejectedValue(new NotFoundException('Receta no encontrada'));
      await expect(controller.update('nonexistentid', { indicaciones: 'x' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with correct id and dto', async () => {
      mockRecetasService.update.mockResolvedValue({ _id: RECETA_ID });
      const dto = { indicaciones: 'Tomar con agua' } as any;
      await controller.update(RECETA_ID, dto);
      expect(mockRecetasService.update).toHaveBeenCalledWith(RECETA_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return success message when removed', async () => {
      mockRecetasService.remove.mockResolvedValue({ message: 'Receta eliminada correctamente' });
      const result = await controller.remove(RECETA_ID);
      expect(result).toEqual({ message: 'Receta eliminada correctamente' });
    });

    it('should propagate NotFoundException when receta does not exist', async () => {
      mockRecetasService.remove.mockRejectedValue(new NotFoundException('Receta no encontrada'));
      await expect(controller.remove('nonexistentid')).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockRecetasService.remove.mockResolvedValue({ message: 'Receta eliminada correctamente' });
      await controller.remove(RECETA_ID);
      expect(mockRecetasService.remove).toHaveBeenCalledWith(RECETA_ID);
    });

  });

});
