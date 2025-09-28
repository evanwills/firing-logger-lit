export type ExternalBlurOptions = {
  autoUnset?: boolean,
  collapsed?: boolean,
  doConsole?: boolean,
  listen?: boolean,
  watcherNode?: HTMLElement,
};

export type FEventHandler = (event: Event) => void;

export type TExternalBlur = {
  doAutoUnset : (doIt : boolean = true) => void,
  logToConsole : (doIt : boolean = false) => void,
  listed : () => boolean,
  ignore : () => boolean,
}
