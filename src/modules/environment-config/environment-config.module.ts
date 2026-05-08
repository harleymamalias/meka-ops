import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from './environment-config';

@Module({
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
