import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(private readonly configService: ConfigService) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run seed on production');
    }

    // Limpiar la base de datos
    // Crear Usuarios
    // Crear Items
    return true;
  }
}
