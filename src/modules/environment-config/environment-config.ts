import { Injectable, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { appConfig } from '../../config/app.config';
import { dbConfig } from '../../config/database.config';
import { jwtConfig } from '../../config/jwt.config';
import { throttlerConfig } from '../../config/throttler.config';

@Injectable()
export class EnvironmentConfigService {
  constructor(
    @Inject(appConfig.KEY)
    public readonly app: ConfigType<typeof appConfig>,

    @Inject(dbConfig.KEY)
    public readonly db: ConfigType<typeof dbConfig>,

    @Inject(jwtConfig.KEY)
    public readonly jwt: ConfigType<typeof jwtConfig>,

    @Inject(throttlerConfig.KEY)
    public readonly throttler: ConfigType<typeof throttlerConfig>,
  ) {}
}
