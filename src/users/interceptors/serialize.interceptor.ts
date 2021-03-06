import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(ctx: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before request handler

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out.
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
