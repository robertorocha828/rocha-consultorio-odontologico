import { Test, TestingModule } from '@nestjs/testing';
import { TiposTratamientoService } from './tipos-tratamiento.service';

describe('TiposTratamientoService', () => {
  let service: TiposTratamientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposTratamientoService],
    }).compile();

    service = module.get<TiposTratamientoService>(TiposTratamientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
