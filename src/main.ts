import { Plugin } from "obsidian";
import { ImportRecipeModal } from "./prompt";

export default class CooklangImporterPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "cooklang-import",
      name: "Import Recipe URL as Cooklang",
      icon: "documents",
      callback: async () => {
        await this.displayImportRecipeModal();
      },
    });
  }

  cookFileCreator = async (recipeName: string, content: string) => {
    let newFileFolderPath = null;
    const newFileLocation = (this.app.vault as any).getConfig("newFileLocation");
    if (!newFileLocation || newFileLocation === "root") {
      newFileFolderPath = "";
    } else if (newFileLocation === "current") {
      newFileFolderPath = this.app.workspace.getActiveFile()?.parent?.path;
    } else {
      newFileFolderPath = (this.app.vault as any).getConfig("newFileFolderPath");
    }
    if (!newFileFolderPath) newFileFolderPath = "";
    else if (!newFileFolderPath.endsWith("/")) newFileFolderPath += "/";

    const originalPath = newFileFolderPath;
    newFileFolderPath = newFileFolderPath + recipeName + ".cook";
    let i = 0;

    while (this.app.vault.getAbstractFileByPath(newFileFolderPath)) {
      newFileFolderPath = `${originalPath}${recipeName} ${++i}.cook`;
    }
    const newFile = await this.app.vault.create(newFileFolderPath, content);
    return newFile;
  };

  async displayImportRecipeModal(): Promise<void> {
    const importRecipe = new ImportRecipeModal(this);
    importRecipe.open();
  }

  onunload(): void {}
}
