import { MarkdownView, Plugin } from "obsidian";

export default class PageScrollPlugin extends Plugin {
  async onload() {
    /* 命令 */

    this.addCommand({
      id: "page-scroll-down-command",
      name: "page-down",
      callback: () => this.scroll("down"),
      hotkeys: [{ key: "AudioVolumeDown", modifiers: [] }],
    });

    this.addCommand({
      id: "page-scroll-up-command",
      name: "page-up",
      callback: () => this.scroll("up"),
      hotkeys: [{ key: "AudioVolumeUp", modifiers: [] }],
    });

    this.addCommand({
      id: "page-scroll-top-command",
      name: "page-top",
      callback: () => this.scroll("top"),
    });

    this.addCommand({
      id: "page-scroll-bottom-command",
      name: "page-bottom",
      callback: () => this.scroll("bottom"),
    });

    /* 按钮，移动端和桌面端位置不同 */
    if (this.app.isMobile) {
      this.registerButton("top", "⇈", 64, 2);
      this.registerButton("up", "↑", 56, 2);
      this.registerButton("down", "↓", 48, 2);
      this.registerButton("bottom", "⇊", 40, 2);
    } else {
      this.registerButton("top", "⇈", 16, 1);
      this.registerButton("up", "↑", 12, 1);
      this.registerButton("down", "↓", 8, 1);
      this.registerButton("bottom", "⇊", 4, 1);
    }
  }

  onunload() {
    this.clearButton();
  }

  currentView() {
    return this.app.workspace.getActiveViewOfType(MarkdownView);
  }

  /** mode = top|bottom|up|down */
  scroll(mode: string) {
    console.log("scroll", mode);
    let thisView = this.app.workspace.getActiveViewOfType(MarkdownView);
    let thisScrollObj =
      thisView?.getMode() == "preview"
        ? thisView?.previewMode?.renderer?.previewEl
        : thisView?.editMode?.cm?.scrollDOM;
    if (!thisScrollObj) {
      console.error("scroll failed ==> scrollObj is missing");
      return;
    }
    let range = thisScrollObj.clientHeight - 60;
    switch (mode) {
      case "up":
        thisScrollObj.scrollBy(0, -range);
        break;
      case "down":
        thisScrollObj.scrollBy(0, range);
        break;
      case "top":
        thisScrollObj.scroll(0, 0);
        break;
      case "bottom":
        thisScrollObj.scroll(0, thisScrollObj.scrollHeight);
        break;
    }
  }

  /** 创建按钮 */
  registerButton(
    mode: string,
    name: string,
    offsetBottom: number,
    offsetRight: number
  ) {
    let self = this;
    let buttonId = mode + "TriskiPageBtn";
    if (!document.getElementById(buttonId)) {
      let button = document.createElement("button");
      button.id = buttonId;
      button.style = `position: absolute; bottom: ${offsetBottom}%; right: ${offsetRight}%; background-color: transparent; width: 27px; border-color: black;`;
      button.onclick = () => self.scroll(mode);
      button.innerHTML = name;
      document.body.appendChild(button);
    }
  }

  /** 删除按钮 */
  clearButton() {
    document.getElementById("upTriskiPageBtn")?.remove();
    document.getElementById("downTriskiPageBtn")?.remove();
    document.getElementById("topTriskiPageBtn")?.remove();
    document.getElementById("bottomTriskiPageBtn")?.remove();
  }
}
