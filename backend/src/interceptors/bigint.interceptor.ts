import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  private transformValue(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'bigint') {
      console.log('BigIntInterceptor: Converting BigInt to string:', value);
      return value.toString();
    }

    if (Array.isArray(value)) {
      return value.map(item => this.transformValue(item));
    }

    if (typeof value === 'object') {
      const transformed: any = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          try {
            transformed[key] = this.transformValue(value[key]);
          } catch (error) {
            console.error(`BigIntInterceptor: Error transforming key ${key}:`, error);
            // If transformation fails, try to convert to string
            if (typeof value[key] === 'bigint') {
              transformed[key] = value[key].toString();
            } else {
              transformed[key] = value[key];
            }
          }
        }
      }
      return transformed;
    }

    return value;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(`BigIntInterceptor: Intercepting ${request.method} ${request.url}`);
    
    return next.handle().pipe(
      map(data => {
        console.log('BigIntInterceptor: Transforming response data');
        try {
          const transformed = this.transformValue(data);
          console.log('BigIntInterceptor: Transformation completed successfully');
          return transformed;
        } catch (error) {
          console.error('BigIntInterceptor: Error during transformation:', error);
          return data;
        }
      }),
      catchError(error => {
        console.error('BigIntInterceptor: Error in response:', error);
        throw error;
      })
    );
  }
}
