import { Test, TestingModule } from '@nestjs/testing';
import { ConsultoriosService } from './consultorios.service';

describe('ConsultoriosService', () => {
  let service: ConsultoriosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultoriosService],
    }).compile();

    service = module.get<ConsultoriosService>(ConsultoriosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
