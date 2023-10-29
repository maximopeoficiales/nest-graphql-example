import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ItemsModule } from './items/items.module';
import { SeedModule } from './seed/seed.module';
import { TodoModule } from './todo/todo.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context({ req }) {
          // // Obtiene el token en cada request que se haga al /graphql
          // const token = req.headers.authorization?.replace('Bearer ', '');
          // if (!token) throw Error('Token needed');
          // const payload = jwtService.decode(token);
          // if (!payload) throw Error('Token not valid');
        },
      }),
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // entities: [],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    HelloWorldModule,
    TodoModule,
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
