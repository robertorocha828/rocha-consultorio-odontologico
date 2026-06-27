import { Test, TestingModule } from '@nestjs/testing';
import { ConsultoriosController } from './consultorios.controller';

describe('ConsultoriosController', () => {
  let controller: ConsultoriosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultoriosController],
    }).compile();

    controller = module.get<ConsultoriosController>(ConsultoriosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
