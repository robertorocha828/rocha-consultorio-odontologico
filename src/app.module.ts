import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OdontogramaModule } from './odontograma/odontograma.module'; 
import { PacientesModule } from './pacientes/pacientes.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { OdontologosModule } from './odontologos/odontologos.module';
import { CitasModule } from './citas/citas.module';
import { ConsultoriosModule } from './consultorios/consultorios.module';
import { HorariosModule } from './horarios/horarios.module';
import { TiposTratamientoModule } from './tipos-tratamiento/tipos-tratamiento.module';
import { TratamientosModule } from './tratamientos/tratamientos.module';
import { AuthModule } from './auth/auth.module';
import { PermisosModule } from './permisos/permisos.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { InventarioModule } from './inventario/inventario.module';
import { RecetasModule } from './recetas/recetas.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { HistorialClinicoModule } from './historial-clinico/historial-clinico.module';
import { PagosModule } from './pagos/pagos.module';
import { FacturasModule } from './facturas/facturas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    OdontogramaModule,
    PacientesModule,
    EspecialidadesModule,
    OdontologosModule,
    CitasModule,
    ConsultoriosModule,
    HorariosModule,
    TiposTratamientoModule,
    TratamientosModule,
    AuthModule,
    PermisosModule,
    RolesModule,
    UsersModule,
    MailModule,
    InventarioModule,
    RecetasModule,
    NotificacionesModule,
    HistorialClinicoModule,
    PagosModule,
    FacturasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
