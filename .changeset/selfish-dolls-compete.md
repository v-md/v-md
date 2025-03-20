---
"@v-md/core": patch
---

- **File Management Improvements**: Enhanced file management capabilities in the left-side file navigator, including `New File`, `Upload File`, `New Directory`, `Cut`, `Copy`, `Paste`, `Rename`, and `Delete` operations.
- **Keyboard Shortcuts**: Implemented standard keyboard shortcuts for common file operations (`Cut`, `Copy`, `Paste`, `Rename`, `Delete`) following industry conventions.
- **Customization Support**: The file management system is fully customizable. Developers can extend functionality via plugins using the `onFilesInit` hook. Example implementation:
```ts
import type { Plugin } from '@v-md/core'

const plugin: Plugin = {
  name: 'custom-file-operations-menu',
  onFilesInit(files) {
    const { view } = files.manager

    // Add custom menu items
    view.menuItems.push(/* custom items */)
    
    // Alternatively use dedicated methods
    view.addMenuItem({
      // configuration object
    })
    
    // Remove default menu items
    view.deleteMenuItem(/* identifier */)
  },
}
```
- **API References**:
  - [Menu Item Management API](/libs/core/src/modules/file/manager-view.ts)
  - [MenuItem Type Definitions](/libs/core/src/modules/file/file-view.types.ts)
