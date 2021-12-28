import { Modal, Setting } from "obsidian";
import { scrapeRecipe } from "./importer";
import CooklangImporterPlugin from "./main";

export class ImportRecipeModal extends Modal {
  plugin: CooklangImporterPlugin;
  address: string;

  constructor(plugin: CooklangImporterPlugin) {
    super(plugin.app);
    this.plugin = plugin;
    this.address = "";
  }

  async submitForm(): Promise<void> {
    if (this.address === "") return;
    const result = await scrapeRecipe(this.address);
    if (result) {
      const newFile = await this.plugin.cookFileCreator(result.name, result.content);
      this.app.workspace.getLeaf().openFile(newFile);
      this.close();
    } else {
      this.close();
    }
  }

  onOpen(): void {
    this.contentEl.createEl("h4", { text: "Recipe URL:" });
    this.contentEl.createEl("form", {}, formEl => {
      new Setting(formEl).addText(textEl => {
        textEl.setPlaceholder(
          "example: https://somefoodblog.com/chocolate-chip-cookies/"
        );
        textEl.onChange(value => {
          this.address = value.trim();
        });
        textEl.inputEl.addEventListener("keydown", async (e: KeyboardEvent) => {
          if (e.key === "Enter" && this.address !== " ") {
            e.preventDefault();
            await this.submitForm();
          }
        });
        textEl.inputEl.style.width = "100%";
        window.setTimeout(() => {
          const title = document.querySelector(".setting-item-info");
          if (title) title.remove();
          textEl.inputEl.focus();
        }, 10);
      });

      formEl.createDiv("modal-button-container", buttonContainerEl => {
        buttonContainerEl
          .createEl("button", { attr: { type: "button" }, text: "Never mind" })
          .addEventListener("click", () => this.close());
        buttonContainerEl.createEl("button", {
          attr: { type: "submit" },
          cls: "mod-cta",
          text: "Import Recipe",
        });
      });

      // invoked when button is clicked.
      formEl.addEventListener("submit", async (e: Event) => {
        e.preventDefault();
        if (this.address !== "") await this.submitForm();
      });
    });
  }

  async onClose(): Promise<void> {}
}
