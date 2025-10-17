import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import * as FILES from './templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
  },
});

interface GeneratorOptions {
  resourceName: string;
  skipController?: boolean;
  skipService?: boolean;
  skipRoutes?: boolean;
  skipEntity?: boolean;
}

const args = process.argv.slice(2);
const resourceNameInput = args[0];

if (!resourceNameInput) {
  logger.error('Resource name is required');
  logger.info('Usage: pnpm generate:resource <resource-name>');
  logger.info('Example: pnpm generate:resource user');
  process.exit(1);
}

const resourceName = resourceNameInput.toLowerCase();

const toPascalCase = (str: string): string => {
  const normalized = str.toLowerCase();
  return normalized
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const toCamelCase = (str: string): string => {
  const normalized = str.toLowerCase();
  if (!normalized.includes('-')) {
    return normalized;
  }
  const pascal = toPascalCase(normalized);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toPlural = (str: string): string => {
  if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z')) return `${str}es`;
  if (str.endsWith('y') && !/[aeiou]y$/.test(str)) return `${str.slice(0, -1)}ies`;
  return `${str}s`;
};

class FileWriter {
  static async createDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content.trim(), 'utf-8');
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export class ResourceGenerator {
  private readonly baseDir: string;
  private readonly resourceName: string;
  private readonly resourceNameLower: string;
  private readonly resourceNamePlural: string;

  constructor(private options: GeneratorOptions) {
    this.baseDir = path.join(__dirname, '../../src');
    this.resourceName = toPascalCase(options.resourceName);
    this.resourceNameLower = toCamelCase(options.resourceName);
    this.resourceNamePlural = toPlural(this.resourceNameLower);
  }

  async generate(): Promise<void> {
    logger.info(`Generating resource: ${this.resourceName}`);

    try {
      if (!this.options.skipController) await this.generateFile('Controller', FILES.CONTROLLER_TEMPLATE);
      if (!this.options.skipService) await this.generateFile('Service', FILES.SERVICE_TEMPLATE);
      if (!this.options.skipRoutes) await this.generateFile('Routes', FILES.ROUTES_TEMPLATE);
      if (!this.options.skipEntity) await this.generateFile('Model', FILES.MODEL_TEMPLATE);

      await this.updateSetupRoutes();
      await this.updateModelsConstants();

      logger.info('Resource generated successfully!');
      logger.info('Next steps:');
      logger.info(`  1. Review entity: src/api/${this.resourceNamePlural}/${this.resourceNameLower}Model.ts`);
      logger.info(`  2. Verify routes: src/utils/setupRoutes.ts`);
      logger.info(`  3. Verify models: src/constants/common/models.ts`);
      logger.info(`  4. Create DTOs: src/api/${this.resourceNamePlural}/dtos/`);
      logger.info(`  5. Run migrations if needed`);
    } catch (error) {
      logger.error({ err: error }, 'Error generating resource');
      process.exit(1);
    }
  }

  private async generateFile(
    type: string,
    template: (name: string, nameLower: string, namePlural?: string) => string,
  ): Promise<void> {
    const resourceDir = path.join(this.baseDir, 'api', this.resourceNamePlural);
    const filePath = path.join(resourceDir, `${this.resourceNameLower}${type}.ts`);

    if (await FileWriter.fileExists(filePath)) {
      logger.warn(`${type} already exists`);
      return;
    }

    await FileWriter.createDirectory(resourceDir);
    const content = template(this.resourceName, this.resourceNameLower, this.resourceNamePlural);
    await FileWriter.writeFile(filePath, content);
  }

  private async updateSetupRoutes(): Promise<void> {
    const setupRoutesPath = path.join(this.baseDir, 'utils', 'setupRoutes.ts');

    if (!(await FileWriter.fileExists(setupRoutesPath))) {
      logger.warn('setupRoutes.ts not found, skipping route registration');
      return;
    }

    try {
      const content = await fs.readFile(setupRoutesPath, 'utf-8');
      const routeKey = this.resourceName.toUpperCase();

      if (content.includes(`${routeKey}:`)) {
        logger.info(`Route ${routeKey} already exists in setupRoutes.ts`);
        return;
      }

      const routeImport = `${routeKey}: () => import('@/api/${this.resourceNamePlural}/${this.resourceNameLower}Routes.js'),`;
      const pathEntry = `${routeKey}: '/${this.resourceNamePlural}',`;
      const appUse = `app.use(PATHS.${routeKey}, (await PRODUCTION_ROUTES.${routeKey}()).default);`;

      const updatedRoutes = content.replace(
        /(const PRODUCTION_ROUTES = \{[\s\S]*?)(\/\/ Add more routes here as needed)/,
        `$1    ${routeImport}\n    $2`,
      );

      const updatedPaths = updatedRoutes.replace(
        /(const PATHS = \{[\s\S]*?)(\/\/ Add more paths here as needed)/,
        `$1    ${pathEntry}\n    $2`,
      );

      const finalContent = updatedPaths.replace(/(try \{[\s\S]*?app\.use\(PATHS\.\w+[^;]*\);)/, `$1\n    ${appUse}`);

      await fs.writeFile(setupRoutesPath, finalContent, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Error updating setupRoutes.ts');
    }
  }

  private async updateModelsConstants(): Promise<void> {
    const modelsConstantsPath = path.join(this.baseDir, 'constants', 'common', 'models.ts');

    if (!(await FileWriter.fileExists(modelsConstantsPath))) {
      logger.warn('models.ts not found, skipping model registration');
      return;
    }

    try {
      const content = await fs.readFile(modelsConstantsPath, 'utf-8');

      if (content.includes(`from '@/api/${this.resourceNamePlural}/${this.resourceNameLower}Model.js'`)) {
        logger.info(`Model ${this.resourceName} already imported in models.ts`);
        return;
      }

      const importStatement = `import { ${this.resourceName} } from '@/api/${this.resourceNamePlural}/${this.resourceNameLower}Model.js';`;
      const modelNameKey = this.resourceName.toUpperCase();
      const modelNameEntry = `  ${modelNameKey}: '${this.resourceName}',`;

      const updatedImports = content.replace(
        /(import.*?;\n)(\nexport const EXPORTED_MODELS)/,
        `$1${importStatement}\n$2`,
      );

      const updatedExports = updatedImports.replace(
        /(export const EXPORTED_MODELS = \[)([\s\S]*?)(\];)/,
        `$1$2, ${this.resourceName}$3`,
      );

      const finalContent = updatedExports.replace(
        /(export const MODELS_NAMES = \{[\s\S]*?)(} as const;)/,
        `$1${modelNameEntry}\n$2`,
      );

      await fs.writeFile(modelsConstantsPath, finalContent, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Error updating models.ts');
    }
  }
}

const generator = new ResourceGenerator({ resourceName });
void generator.generate();
