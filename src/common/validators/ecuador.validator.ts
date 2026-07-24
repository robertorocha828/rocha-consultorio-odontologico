import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function esCedulaEcuatorianaValida(cedula: string): boolean {
  if (typeof cedula !== 'string' || !/^\d{10}$/.test(cedula)) return false;

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  const tercerDigito = parseInt(cedula[2], 10);
  if (tercerDigito > 6) return false;

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i], 10) * coeficientes[i];
    if (valor >= 10) valor -= 9;
    suma += valor;
  }
  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === parseInt(cedula[9], 10);
}

export function esCelularEcuatorianoValido(telefono: string): boolean {
  return typeof telefono === 'string' && /^0\d{9}$/.test(telefono);
}

export function IsCedulaEcuatoriana(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCedulaEcuatoriana',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && esCedulaEcuatorianaValida(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} no es una cédula ecuatoriana válida`;
        },
      },
    });
  };
}

export function IsCelularEcuatoriano(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCelularEcuatoriano',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && esCelularEcuatorianoValido(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe tener exactamente 10 dígitos y empezar con 0`;
        },
      },
    });
  };
}