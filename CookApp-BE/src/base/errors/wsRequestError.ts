import { ValidationError } from "@nestjs/common";

export class WsRequestValidationError extends Error {
  constructor(errors: ValidationError[]) {
    super()
    this.message = errors.reduce((pre, cur) => flattenError(cur, pre), "")
    this.name = WsRequestValidationError.name
  }

}

function flattenError(err: ValidationError, pre: string = ""): string {
  for (let key in err.constraints) {
    if (err.constraints.hasOwnProperty(key)) {
      pre += `${err.constraints[key]},\n`
    }
  }
  for (let key in err.children) {
    if (err.constraints.hasOwnProperty(key))
      pre += flattenError(err.children[key], pre)
  }
  return pre
}
