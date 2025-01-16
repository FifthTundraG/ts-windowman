# ts-windowman
TypeScript Window Manager for the web

## What am I looking at?
Y'know what a window manager is? The thing that makes the windows on your screen move? Yeah, that thing. I basically made that. But for the web. And 10x worse.

## How do I use it?
Here's an example (it's pretty self-explainatory):
```ts
import { Window, WindowMan } from "ts-windowman";

const windowman = new WindowMan();

windowman.init(document.body); // this will just be whatever you want the canvas to be on. the canvas is where the windows are. it's positioned absolutely so will not interfere with any of the other elements in the container.

windowman.createWindow(new Window(200,100,"hello world!")); // 200x100 window with "hello world!" as the title
windowman.createWindow(new Window(500,250,"hi there hello")); // see above, just different now
```