interface WindowManConfig {
    /** Height of titlebar in px */
    titlebarHeight: number;
    /** `border-width` of window */
    windowBorder: number;
}

export class WindowMan {
    canvas: HTMLDivElement;
    config: WindowManConfig;

    initializedCanvas: boolean;

    // these are used for dragging the window and yes will be changed later
    activeWindowInitialMouseDownX: number;
    activeWindowInitialMouseDownY: number;
    movingWindow: boolean;

    constructor() {
        this.initializedCanvas = false;
        
        this.config = {
            titlebarHeight: 20,
            windowBorder: 1
        }

        this.activeWindowInitialMouseDownX = 0;
        this.activeWindowInitialMouseDownY = 0;
        this.movingWindow = false;

        this.canvas = document.createElement("div");
    }

    /**
     * Sets up a WindowMan canvas on the element
     * @param element Element to set the canvas up on
     */
    init(element: HTMLElement) {
        if (this.initializedCanvas) throw new Error("Cannot initialize canvas twice!");

        // inject stylesheet
        const style = document.createElement('style');
        style.innerHTML = `
        /* ts-windowman Injected Stylesheet */
        .no-select { 
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }`;
        document.head.appendChild(style);

        this.canvas.id = "tswindowman-canvas";
        this.canvas.style.height = "100%";
        this.canvas.style.width = "100%";
        this.canvas.style.position = "absolute";

        element.appendChild(this.canvas);

        this.initializedCanvas = true;
        console.log("Initialized ts-windowman canvas.");
    }


    createWindow(window: Window) {
        window.html.style.width = window.width.toString()+"px";
        window.html.style.height = window.height.toString()+"px";
        window.html.style.border = `solid ${this.config.windowBorder.toString()}px black`;
        window.html.style.position = "absolute";
        // the dragWindow() func gets angry when there's no existing left/top styles, fix later maybe
        window.html.style.top = "0px";
        window.html.style.left = "0px";
            const titlebar = document.createElement("div");
            titlebar.style.display = "flex";
            titlebar.style.height = this.config.titlebarHeight.toString()+"px";
            titlebar.style.alignItems = "center";
            titlebar.style.justifyContent = "center";
            titlebar.style.padding = "1px";
            titlebar.style.position = "relative"; //?
            const dragElemAnon = (e: MouseEvent) => {
                dragElement(e, window.html)
            };
            titlebar.addEventListener("mousedown", () => {
                document.addEventListener("mousemove", dragElemAnon);
                console.log("mousdown")
            });
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", dragElemAnon);
                console.log("mouseup")
            });
                const title = document.createElement("p");
                title.innerText = window.title;
                title.style.fontSize = "12px";
                title.style.margin = "0";
                title.className = "no-select";
                titlebar.appendChild(title);

                const buttons = document.createElement("div");
                buttons.style.position = "absolute";
                buttons.style.right = "7px";
                buttons.className = "no-select";
                    const xbutton = document.createElement("p");
                    xbutton.innerText = "x";
                    xbutton.style.fontSize = "14px";
                    xbutton.style.margin = "0";
                    xbutton.addEventListener("click", (e) => {
                        e.stopPropagation();
                        window.kill();
                    });
                    buttons.appendChild(xbutton);
                titlebar.appendChild(buttons);
            window.html.appendChild(titlebar);
        this.canvas.appendChild(window.html);
    }
}

export class Window {
    // private _windowman: WindowMan;
    width: number;
    height: number;
    title: string;

    html: HTMLDivElement;

    constructor(width: number, height: number, title: string) {
        // this._windowman = windowman;
        this.width = width;
        this.height = height;
        this.title = title;

        this.html = document.createElement("div");
    }

    kill() {
        this.html.remove();
    }
}

function dragElement(e: MouseEvent, element: HTMLElement) {
    let leftValue = parseInt(element.style.left);
    let topValue = parseInt(element.style.top);
    element.style.left = `${leftValue + e.movementX}px`;
    element.style.top = `${topValue + e.movementY}px`;
    console.log("dragging: "+element.id)
}