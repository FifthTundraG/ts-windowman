interface WindowManConfig {
    /** color of the titlebar window decoration */
    titlebarColor: string;
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
            windowBorder: 1,
            titlebarColor: "#EFF0F1"
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
        this.canvas.style.overflow = "hidden";

        element.appendChild(this.canvas);

        this.initializedCanvas = true;
        console.log("Initialized ts-windowman canvas.");
    }

    createWindow(window: Window) {
        window.html.style.border = `solid ${this.config.windowBorder.toString()}px black`;
        window.html.addEventListener("mousedown", () => {
            this.canvas.append(window.html) // makes the window that was just touched be drawn above all the others
        });
            const titlebar = document.createElement("div");
            titlebar.style.display = "flex";
            titlebar.style.height = this.config.titlebarHeight.toString()+"px";
            titlebar.style.alignItems = "center";
            titlebar.style.justifyContent = "center";
            titlebar.style.padding = "1px";
            titlebar.style.position = "relative"; //?
            titlebar.style.backgroundColor = this.config.titlebarColor;
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

            if (window.content !== undefined) window.html.appendChild(window.content);
        this.canvas.appendChild(window.html);
    }
}

export class Window {
    // private _windowman: WindowMan;
    _width: number = 0;
    set width(num: number) {
        this._width = num;
        this.html.style.width = this.width.toString()+"px";
    }
    get width(): number {
        return this._width;
    }
    _height: number = 0;
    set height(num: number) {
        this._height = num;
        this.html.style.height = this.height.toString()+"px";
    }
    get height(): number {
        return this._height;
    }
    title: string;

    // configuration
    drawDecorations: boolean; // whether or not to have WindowMan draw the window decoration. if you add your own this should be false

    // html
    html: HTMLDivElement;
    /** this is the stuff you see in the window. think the writing part of notepad or the painting part of mspaint. NOT the titlebar. */
    content: HTMLElement | undefined;

    constructor(width: number, height: number, title: string, content: HTMLElement=document.createElement("div")) {
        // this._windowman = windowman;
        this.html = document.createElement("div");
        this.html.style.backgroundColor = "white"; // the window is transparent without this and just to avoid confusion let's make that not be the case
        this.html.style.position = "absolute";
        // the dragWindow() func gets angry when there's no existing left/top styles, fix later maybe
        this.html.style.top = "0px";
        this.html.style.left = "0px";

        // this.html must be assigned a value before width/height, see setters
        this.width = width;
        this.height = height;
        this.title = title;

        // configuration
        this.drawDecorations = true;

        this.content = content;
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