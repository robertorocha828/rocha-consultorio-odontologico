import { Test, TestingModule } from '@nestjs/testing';
import { EspecialidadesController } from './especialidades.controller';

describe('EspecialidadesController', () => {
  let controller: EspecialidadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspecialidadesController],
    }).compile();

    controller = module.get<EspecialidadesController>(EspecialidadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
