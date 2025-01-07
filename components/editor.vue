<!-- <template>
  <section>
    <ckeditor :editor="editor" v-model="html" :config="editorConfig"></ckeditor>
  </section>
</template>

<script type="text/javascript">
import Vue from "vue";

export default {
  name: "Editor",
  data: () => ({
    html: "",
    editor: "",
    editorConfig: {
      height: "800px",
      color: "red",
      ckfinder: {},
    },
  }),
  props: ["data"],
  watch: {
    html: "updateData",
    data: "updateHtml",
  },
  created() {
    this.html = this.data;
    var CKEDITOR = require("@ckeditor/ckeditor5-vue");
    Vue.use(CKEDITOR);

    var ClassicEditor = require("@ckeditor/ckeditor5-build-classic");
    this.editor = ClassicEditor;
  },
  methods: {
    updateData() {
      this.$emit("update:data", this.html);
    },
    updateHtml() {
      this.html = this.data;
    },
  },
};
</script> -->
<template>
  <section>
    <ckeditor
      :editor="editor"
      v-model="localHtml"
      :config="editorConfig"
    ></ckeditor>
  </section>
</template>

<script type="text/javascript">
import Vue from "vue";

export default {
  name: "Editor",
  props: {
    data: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    localHtml: "",
    editor: "",
    editorConfig: {
      height: "800px",
      color: "red",
      ckfinder: {},
    },
  }),
  watch: {
    localHtml(newVal) {
      this.$emit("update:data", newVal);
    },
    data: {
      immediate: true,
      handler(newVal) {
        this.localHtml = newVal;
      },
    },
  },
  created() {
    this.localHtml = this.data;

    const CKEDITOR = require("@ckeditor/ckeditor5-vue");
    Vue.use(CKEDITOR);

    const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");
    this.editor = ClassicEditor;
  },
};
</script>
