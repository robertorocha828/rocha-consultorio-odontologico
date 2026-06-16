import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
    "status" : "Online",
    "service": "rocha-consultorio-odontologico api",
    "version" : "0.0.1",
    "date": new Date(),
    }
  }
}