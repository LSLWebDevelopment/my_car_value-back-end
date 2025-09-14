import {
  UseInterceptors,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassValidator {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassValidator) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassValidator) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Here goes the code to run before the request is handled by the handler in our controller
    console.log(context);

    return next.handle().pipe(
      map((data: ClassValidator) => {
        // Here goes the code to run before the response is sent
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
