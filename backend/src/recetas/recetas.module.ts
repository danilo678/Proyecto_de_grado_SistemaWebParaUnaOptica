import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Receta])],
  controllers: [RecetasController],
  providers: [RecetasService],
  exports: [RecetasService],
})
export class RecetasModule {}
