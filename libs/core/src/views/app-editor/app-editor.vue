<script setup lang="ts">
import { Editor } from '../../modules/editor'
import { Layout } from '../layout'
import { ViewEditor } from '../view-editor'
import { ViewFiles } from '../view-files'
import { ViewPreview } from '../view-preview'

const editor = Editor.use()
const {
  options,
} = editor
</script>

<template>
  <Layout id="vmd-app" v-bind="options.attrs">
    <template #nav>
      <ViewFiles />
    </template>
    <ViewEditor />
    <template #preview>
      <ViewPreview />
    </template>
  </Layout>
</template>
