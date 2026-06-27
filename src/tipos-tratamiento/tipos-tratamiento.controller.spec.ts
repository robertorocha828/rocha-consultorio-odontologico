import { Test, TestingModule } from '@nestjs/testing';
import { TiposTratamientoController } from './tipos-tratamiento.controller';

describe('TiposTratamientoController', () => {
  let controller: TiposTratamientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposTratamientoController],
    }).compile();

    controller = module.get<TiposTratamientoController>(TiposTratamientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
