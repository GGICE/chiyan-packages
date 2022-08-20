export interface TaskOptions {
  url: string;
  name: string;
  projectPath: string;
  templateProjectPath?: string;
}

export type AsJSON = Record<string, any>;

export interface Config {
  baseTemplate: string; // 基础模板必须声明
}
