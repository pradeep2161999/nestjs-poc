import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
