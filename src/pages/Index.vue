<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page>
      <q-table
        class="q-mb-2xl"
        title="Anotações"
        :rows="notes"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="edit"
              @click="editNote(props.row)"
              color="primary"
              dense
            />
            <q-btn
              icon="delete"
              @click="confirmDelete(props.row.key)"
              color="negative"
              dense
            />
          </q-td>
        </template>
      </q-table>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="primary" to="form" />
      </q-page-sticky>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent } from "vue";
import db from "boot/database";
export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      collection: "notes",
      notes: [],
      columns: [
        {
          name: "title",
          field: "title",
          required: true,
          label: "Título",
          align: "left",
          sortable: true,
        },
        {
          name: "actions",
          field: "actions",
          align: "right",
        },
      ],
    };
  },
  mounted() {
    this.getNotes();
  },
  methods: {
    async getNotes() {
      try {
        let notesDb = await db.collection(this.collection).get({ keys: true });
        this.notes = notesDb.map((note) => {
          return {
            ...note.data,
            key: note.key,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    editNote(noteprop) {
      this.$router.push({ name: "formNote", params: noteprop });
    },
    confirmDelete(keyNote) {
      this.$q
        .dialog({
          title: "Deletar Anotação",
          icon: 'delete',
          message: "Tem certeza que deseja deletar essa anotação ?",
          persistent: false,
          ok: "Deletar",
          cancel: "Cancelar",
        })
        .onOk(() => {
          this.deleteNote(keyNote);
        });
    },
    async deleteNote(keyNote) {
      try {
        await db.collection(this.collection).doc(keyNote).delete();
        this.$q.notify({
          message: "Anotação excluída com sucesso!",
          color: "negative",
          timeout: 1500,
          icon: "delete",
        });
        this.getNotes();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.q-mb-2xl {
  margin-bottom: 80px;
}
</style>
