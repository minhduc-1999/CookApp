import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { MetaDTO } from "base/dtos/responseMeta.dto";

export const ApiFailResponseCustom = <TModel extends Type<any>>() => {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
    ApiInternalServerErrorResponse({ description: "Server Error" }),
    ApiBadRequestResponse({
      description: "Bad Request - Check messages in response",
    })
  );
};

export const ApiBadReqResponseCustom = <TModel extends Type<any>>(
  description?: string
) => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: `Bad Request ${description ? "- " + description : ""}`,
    })
  );
};

export const ApiCreatedResponseCustom = <TModel extends Type<any>>(
  model: TModel,
  description: string
) => {
  return applyDecorators(
    ApiCreatedResponse({
      description: description,
      schema: {
        properties: {
          meta: {
            type: "object",
            $ref: getSchemaPath(MetaDTO),
          },
          data: {
            type: "object",
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
    ApiExtraModels(MetaDTO, model)
  );
};

export const ApiOKResponseCustom = <TModel extends Type<any>>(
  model: TModel,
  description?: string
) => {
  return applyDecorators(
    ApiOkResponse({
      description: description,
      schema: {
        properties: {
          meta: {
            type: "object",
            $ref: getSchemaPath(MetaDTO),
          },
          data: {
            type: "object",
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
    ApiExtraModels(MetaDTO, model)
  );
};

export const ApiOKResponseCustomWithoutData = (description?: string) => {
  return applyDecorators(
    ApiOkResponse({
      description: description,
      schema: {
        properties: {
          meta: {
            type: "object",
            $ref: getSchemaPath(MetaDTO),
          },
        },
      },
    })
  );
};

export const ApiOKListResponseCustom = <TModel extends Type<any>>(
  model: TModel,
  listFieldName: string,
  description: string
) => {
  const schemaChild = {
    type: "array",
    items: {
      $ref: getSchemaPath(model),
    },
  };
  const childProp = {};
  childProp[`${listFieldName}`] = schemaChild;
  return applyDecorators(
    ApiOkResponse({
      description: description,
      schema: {
        properties: {
          meta: {
            type: "object",
            $ref: getSchemaPath(MetaDTO),
          },
          data: {
            type: "object",
            properties: childProp,
          },
        },
      },
    }),
    ApiExtraModels(MetaDTO, model)
  );
};

export const ApiOKPaginationResponseCustom = <TModel extends Type<any>>(
  model: TModel,
  listFieldName: string,
  description: string
) => {
  const schemaChild = {
    type: "array",
    items: {
      $ref: getSchemaPath(model),
    },
  };
  const childProp = {
    itemsPerPage: {
      type: "number",
    },
    page: {
      type: "number",
    },
    totalItems: {
      type: "number",
    },
  };
  childProp[`${listFieldName}`] = schemaChild;
  return applyDecorators(
    ApiOkResponse({
      description: description,
      schema: {
        properties: {
          meta: {
            type: "object",
            $ref: getSchemaPath(MetaDTO),
          },
          data: {
            type: "object",
            properties: childProp,
          },
        },
      },
    }),
    ApiExtraModels(MetaDTO, model)
  );
};
