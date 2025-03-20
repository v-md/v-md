import type { FileNavMenuItem } from './file-view.types'

export function defaultFileNavMenu(): FileNavMenuItem[] {
  return [
    {
      name: 'create-file',
      label: '新建文件',
      enable: file => file.isFolder.value && file.keyType.value !== 'nodeModules',
      onTrigger: (file) => {
        const { view } = file
        view.onCreateFile()
        view.hideMenu()
      },
    },
    {
      name: 'upload-file',
      label: '上传文件',
      enable: file => file.isFolder.value && file.keyType.value !== 'nodeModules',
      onTrigger: (file) => {
        const { view } = file
        view.onUploadFile()
        view.hideMenu()
      },
    },
    {
      name: 'create-folder',
      label: '新建目录',
      enable: file => file.isFolder.value && file.keyType.value !== 'nodeModules',
      onTrigger: (file) => {
        const { view } = file
        view.onCreateFolder()
        view.hideMenu()
      },
    },
    '-',
    {
      name: 'cut',
      label: '剪切',
      keyboardLabel: 'Ctrl + X',
      keyboard: (view) => {
        const { activeKeys, focusFile } = view
        const valid = (activeKeys.has('ControlLeft') || activeKeys.has('ControlRight')) &&
          activeKeys.has('KeyX') &&
          activeKeys.size === 2
        if (!valid) {
          return null
        }

        return focusFile.value
      },
      enable: file => !file.keyType.value,
      onTrigger: (file) => {
        const { view } = file
        view.onCut()
        view.hideMenu()
      },
    },
    {
      name: 'copy',
      label: '复制',
      keyboardLabel: 'Ctrl + C',
      keyboard: (view) => {
        const { activeKeys, focusFile } = view
        const valid = (activeKeys.has('ControlLeft') || activeKeys.has('ControlRight')) &&
          activeKeys.has('KeyC') &&
          activeKeys.size === 2
        if (!valid) {
          return null
        }

        return focusFile.value
      },
      enable: file => file.keyType.value !== 'nodeModules' && file.keyType.value !== 'root',
      onTrigger: (file) => {
        const { view } = file
        view.onCopy()
        view.hideMenu()
      },
    },
    {
      name: 'paste',
      label: '粘贴',
      keyboardLabel: 'Ctrl + V',
      enable: file => file.isFolder.value && file.keyType.value !== 'nodeModules',
      keyboard: (view) => {
        const { activeKeys, focusFile } = view
        const valid = (activeKeys.has('ControlLeft') || activeKeys.has('ControlRight')) &&
          activeKeys.has('KeyV') &&
          activeKeys.size === 2
        if (!valid) {
          return null
        }

        if (!focusFile.value) {
          return null
        }

        const { isFolder } = focusFile.value
        return isFolder.value ? focusFile.value : focusFile.value.parent.value
      },
      onTrigger: (file) => {
        const { view } = file
        view.onPaste()
        view.hideMenu()
      },
    },
    '-',
    {
      name: 'rename',
      label: '重命名',
      keyboardLabel: 'F2',
      keyboard: (view) => {
        const { activeKeys, focusFile } = view
        const valid = activeKeys.has('F2') && activeKeys.size === 1
        if (!valid) {
          return null
        }

        return focusFile.value
      },
      enable: file => file.keyType.value !== 'nodeModules' && file.keyType.value !== 'root',
      onTrigger: (file) => {
        const { view } = file
        view.onRename()
        view.hideMenu()
      },
    },
    {
      name: 'delete',
      label: '删除',
      keyboardLabel: 'Delete',
      keyboard: (view) => {
        const { activeKeys, focusFile } = view
        const valid = activeKeys.has('Delete') && activeKeys.size === 1
        if (!valid) {
          return null
        }

        return focusFile.value
      },
      enable: file => !file.keyType.value,
      onTrigger: (file) => {
        const { view } = file
        view.hideMenu()
        view.showConfirm({
          message: `是否删除${file.isFolder.value ? '目录' : '文件'}：${file.name.value}？删除后不可恢复。`,
          onConfirm: () => {
            view.onDelete()
            view.hideConfirm()
          },
        })
      },
    },
  ]
}
