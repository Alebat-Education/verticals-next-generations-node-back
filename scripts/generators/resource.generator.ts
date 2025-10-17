import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as FILES from './templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  console.error('❌ Error: Resource name is required');
  console.log('Usage: pnpm generate:resource <resource-name>');
  console.log('Example: pnpm generate:resource user');
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

class FileWriter {
  static async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Error creating directory ${dirPath}: ${error}`);
    }
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content.trim(), 'utf-8');
      console.log(`✅ Created: ${filePath}`);
    } catch (error) {
      throw new Error(`Error writing file ${filePath}: ${error}`);
    }
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

  constructor(private options: GeneratorOptions) {
    this.baseDir = path.join(__dirname, '../../src');
    this.resourceName = toPascalCase(options.resourceName);
    this.resourceNameLower = toCamelCase(options.resourceName);
  }

  async generate(): Promise<void> {
    console.log(`\n🚀 Generating resource: ${this.resourceName}\n`);

    try {
      if (!this.options.skipController) {
        await this.generateController();
      }

      if (!this.options.skipService) {
        await this.generateService();
      }

      if (!this.options.skipRoutes) {
        await this.generateRoutes();
      }

      if (!this.options.skipEntity) {
        await this.generateEntity();
      }

      await this.updateSetupRoutes();
      await this.updateModelsConstants();

      console.log('\n✨ Resource generated successfully!\n');
      console.log('📝 Next steps:');
      console.log(
        `   1. Review and customize the entity in src/api/${this.resourceNameLower}/${this.resourceNameLower}Model.ts`,
      );
      console.log(`   2. Verify the route registration in src/utils/setupRoutes.ts`);
      console.log(`   3. Verify the model import in src/constants/common/models.ts`);
      console.log(`   4. Create DTOs in src/api/${this.resourceNameLower}/dtos/ if needed`);
      console.log(`   5. Run migrations if needed\n`);
    } catch (error) {
      console.error('❌ Error generating resource:', error);
      process.exit(1);
    }
  }

  private async generateController(): Promise<void> {
    const resourceDir = path.join(this.baseDir, 'api', this.resourceNameLower);
    const controllerPath = path.join(resourceDir, `${this.resourceNameLower}Controller.ts`);

    if (await FileWriter.fileExists(controllerPath)) {
      console.log(`⚠️  Controller already exists: ${controllerPath}`);
      return;
    }

    await FileWriter.createDirectory(resourceDir);
    await FileWriter.writeFile(controllerPath, FILES.CONTROLLER_TEMPLATE(this.resourceName, this.resourceNameLower));
  }

  private async generateService(): Promise<void> {
    const resourceDir = path.join(this.baseDir, 'api', this.resourceNameLower);
    const servicePath = path.join(resourceDir, `${this.resourceNameLower}Service.ts`);

    if (await FileWriter.fileExists(servicePath)) {
      console.log(`⚠️  Service already exists: ${servicePath}`);
      return;
    }

    await FileWriter.createDirectory(resourceDir);
    await FileWriter.writeFile(servicePath, FILES.SERVICE_TEMPLATE(this.resourceName, this.resourceNameLower));
  }

  private async generateRoutes(): Promise<void> {
    const resourceDir = path.join(this.baseDir, 'api', this.resourceNameLower);
    const routesPath = path.join(resourceDir, `${this.resourceNameLower}Routes.ts`);

    if (await FileWriter.fileExists(routesPath)) {
      console.log(`⚠️  Routes already exist: ${routesPath}`);
      return;
    }

    await FileWriter.createDirectory(resourceDir);
    await FileWriter.writeFile(routesPath, FILES.ROUTES_TEMPLATE(this.resourceName, this.resourceNameLower));
  }

  private async generateEntity(): Promise<void> {
    const resourceDir = path.join(this.baseDir, 'api', this.resourceNameLower);
    const entityPath = path.join(resourceDir, `${this.resourceNameLower}Model.ts`);

    if (await FileWriter.fileExists(entityPath)) {
      console.log(`⚠️  Entity already exists: ${entityPath}`);
      return;
    }

    await FileWriter.createDirectory(resourceDir);
    await FileWriter.writeFile(entityPath, FILES.MODEL_TEMPLATE(this.resourceName, this.resourceNameLower));
  }

  private async updateSetupRoutes(): Promise<void> {
    const setupRoutesPath = path.join(this.baseDir, 'utils', 'setupRoutes.ts');

    if (!(await FileWriter.fileExists(setupRoutesPath))) {
      console.log(`⚠️  setupRoutes.ts not found, skipping route registration`);
      return;
    }

    try {
      const content = await fs.readFile(setupRoutesPath, 'utf-8');

      const routeKey = this.resourceName.toUpperCase();
      if (content.includes(`${routeKey}:`)) {
        console.log(`ℹ️  Route ${routeKey} already exists in setupRoutes.ts`);
        return;
      }

      const routeImport = `${routeKey}: () => import('@/api/${this.resourceNameLower}/${this.resourceNameLower}Routes.js'),`;
      const updatedRoutes = content.replace(
        /(const PRODUCTION_ROUTES = \{[\s\S]*?)(\/\/ Add more routes here as needed)/,
        `$1    ${routeImport}\n    $2`,
      );

      const pathEntry = `${routeKey}: '/${this.resourceNameLower}',`;
      const updatedPaths = updatedRoutes.replace(
        /(const PATHS = \{[\s\S]*?)(\/\/ Add more paths here as needed)/,
        `$1    ${pathEntry}\n    $2`,
      );

      const appUse = `app.use(PATHS.${routeKey}, (await PRODUCTION_ROUTES.${routeKey}()).default);`;
      const finalContent = updatedPaths.replace(/(try \{[\s\S]*?app\.use\(PATHS\.\w+[^;]*\);)/, `$1\n    ${appUse}`);

      await fs.writeFile(setupRoutesPath, finalContent, 'utf-8');
      console.log(`✅ Updated: ${setupRoutesPath}`);
    } catch (error) {
      console.error(`⚠️  Error updating setupRoutes.ts: ${error}`);
    }
  }

  private async updateModelsConstants(): Promise<void> {
    const modelsConstantsPath = path.join(this.baseDir, 'constants', 'common', 'models.ts');

    if (!(await FileWriter.fileExists(modelsConstantsPath))) {
      console.log(`⚠️  models.ts not found, skipping model registration`);
      return;
    }

    try {
      const content = await fs.readFile(modelsConstantsPath, 'utf-8');

      if (content.includes(`from '@/api/${this.resourceNameLower}/${this.resourceNameLower}Model.js'`)) {
        console.log(`ℹ️  Model ${this.resourceName} already imported in models.ts`);
        return;
      }

      const importStatement = `import { ${this.resourceName} } from '@/api/${this.resourceNameLower}/${this.resourceNameLower}Model.js';`;
      const updatedImports = content.replace(
        /(import.*?;\n)(\nexport const EXPORTED_MODELS)/,
        `$1${importStatement}\n$2`,
      );

      const updatedExports = updatedImports.replace(
        /(export const EXPORTED_MODELS = \[)([\s\S]*?)(\];)/,
        `$1$2, ${this.resourceName}$3`,
      );

      const modelNameKey = this.resourceName.toUpperCase();
      const modelNameEntry = `  ${modelNameKey}: '${this.resourceName}',`;
      const finalContent = updatedExports.replace(
        /(export const MODELS_NAMES = \{[\s\S]*?)(} as const;)/,
        `$1${modelNameEntry}\n$2`,
      );

      await fs.writeFile(modelsConstantsPath, finalContent, 'utf-8');
      console.log(`✅ Updated: ${modelsConstantsPath}`);
    } catch (error) {
      console.error(`⚠️  Error updating models.ts: ${error}`);
    }
  }
}

const generator = new ResourceGenerator({ resourceName });
void generator.generate();
