export const CONTROLLER_TEMPLATE = (resourceName: string, resourceNameLower: string, resourceNamePlural = '') => `
import { BaseController } from '@common/GlobalController.js';
import { MODELS_NAMES } from '@constants/common/models.js';
import { ${resourceNameLower}Service } from '@/api/${resourceNamePlural}/${resourceNameLower}Service.js';
import { type ${resourceName} } from '@/api/${resourceNamePlural}/${resourceNameLower}Model.js';

export class ${resourceName}Controller extends BaseController<${resourceName}> {
  constructor() {
    super(${resourceNameLower}Service, MODELS_NAMES.${resourceName.toUpperCase()});
  }
  // specific  ${resourceNameLower} routes ...
}

export const ${resourceNameLower}Controller = new ${resourceName}Controller();
`;

export const SERVICE_TEMPLATE = (resourceName: string, resourceNameLower: string, resourceNamePlural = '') => `
import { BaseService } from '@common/GlobalService.js';
import { AppDataSource } from '@config/connection.js';
import { ERROR_DATA_SOURCE_NOT_INITIALIZED } from '@constants/errors/server.js';
import { ${resourceName} } from '@/api/${resourceNamePlural}/${resourceNameLower}Model.js';

class ${resourceName}Service extends BaseService<${resourceName}> {
  constructor() {
    if (!AppDataSource || !AppDataSource.isInitialized) {
      throw new Error(ERROR_DATA_SOURCE_NOT_INITIALIZED);
    }
    super(AppDataSource.getRepository(${resourceName}));
  }

  // specific ${resourceNameLower} methods ...
}

export const ${resourceNameLower}Service = new ${resourceName}Service();`;

export const ROUTES_TEMPLATE = (resourceName: string, resourceNameLower: string, resourceNamePlural = '') => `
import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ValidateParams } from '@middleware/validation-pipe.js';
import { ParamIdDto } from '@common/dtos/ParamIdDto.js';
import { ${resourceNameLower}Controller } from '@/api/${resourceNamePlural}/${resourceNameLower}Controller.js';

// import { Create${resourceName}Dto } from '@/api/${resourceNamePlural}/dtos/Create${resourceName}Dto.js';
// import { Update${resourceName}Dto } from '@/api/${resourceNamePlural}/dtos/Update${resourceName}Dto.js';
// import { Query${resourceName}Dto } from '@/api/${resourceNamePlural}/dtos/Query${resourceName}Dto.js';

const router: ExpressRouter = Router();

router.get('/', (req, res, next) => ${resourceNameLower}Controller.findAll(req, res, next));
router.get('/:id', ValidateParams(ParamIdDto), (req, res, next) => ${resourceNameLower}Controller.findOne(req, res, next));

// router.post('/', ValidateBody(Create${resourceName}Dto), (req, res, next) => ${resourceNameLower}Controller.create(req, res, next));
// router.put('/:id', ValidateParams(ParamIdDto), ValidateBody(Update${resourceName}Dto), (req, res, next) =>
//   ${resourceNameLower}Controller.update(req, res, next),
// );
// router.patch(
//   '/:id',
//   ValidateParams(ParamIdDto),
//   ValidateBody(Update${resourceName}Dto, { skipMissingProperties: true }),
//   (req, res, next) => ${resourceNameLower}Controller.update(req, res, next),
// );
// router.delete('/:id', ValidateParams(ParamIdDto), (req, res, next) => ${resourceNameLower}Controller.delete(req, res, next));

export default router;
`;

export const MODEL_TEMPLATE = (resourceName: string, resourceNameLower: string, _resourceNamePlural?: string) => `
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ${resourceName} {
  @PrimaryGeneratedColumn()
  id!: number;

  // Add your columns here
  //if you need a component, uncomment the following lines and adjust accordingly (JUST AN EXAMPLE)

  // @OneToMany(() => ${resourceNameLower}Component, component => component.${resourceNameLower}, { eager: false })
  // components!: ${resourceNameLower}Component[];
  //
  // @StrapiComponent({
  //   field: 'fullPrice',
  //   componentType: '${resourceNameLower}.full-price',
  //   entity: FullPriceComponent,
  //   tableName: 'components_${resourceNameLower}_full_prices',
  // })
  // fullPrice?: FullPriceComponent | null;

}

`;
