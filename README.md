Undo/Redo support for [easy peasy](https://easy-peasy.now.sh/). 

`undo-peasy` 
* automatically saves a history of state changes made in your application. 
* provides ready to use undo and redo actions.

## Usage

1. Attach `undoRedo` middlware in `createStore`. 
The middleware will automatically save every state change made to an `undoable` model.
    ```
    const store = createStore(appModel, {
      middleware: [undoRedo()],
    });
    ```
1. If using typescript, extend `WithUndo` in the root application model. 
`WithUndo` will add types for undo actions and metadata.
    ```
      interface Model extends WithUndo {
        count: number;
        increment: Action<Model>;
      }
    ```
1. Use `undoable` to wrap the root application model instance. 
`undoable()` will make undo/redo actions available and save state changes forwarded by the middleware.
    ```
    const appModel: Model = undoable({
      count: 0,
      increment: action((state) => {
        state.count++;
      }),
    });
    ```
1. Profit
    ```
    const undoAction = useStoreActions((actions) => actions.undoUndo);
    ```


## Supported Actions
* **`undoUndo`** - restore state to the most recently saved version.
* **`undoRedo`** - restore state to the most recently undone version.
* `undoReset` - erases saved undo/redo history and saves the current state.
* `undoSave` - save current application state to undo history. 
undoSave is generated automatically by the middleware, but in rare cases it's useful to save manually.

## Configuration
The `undoRedo()` middleware function accepts an optional configuration object.
* `noSaveActions` - a function that tells undoRedo to not save certain actions to undo/redo history.

The `undoable()` middleware function accepts an optional configuration object.
* `maxHistory` - maximum number of history states to save. The oldest states are dropped to prevent the history from growing without bounds.
* `noSaveKeys` - a function that tells undoRedo not to save certain keys inside the state model 
to undo/redo history. e.g. view state in the model.



History is persisted in the browser's localStorage.