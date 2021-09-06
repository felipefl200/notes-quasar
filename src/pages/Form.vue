<template>
  <q-page-container>
    <q-page padding>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          ref="titleInput"
          autofocus
          outlined
          v-model="form.title"
          label="Título"
          :rules="[
            (val) => !!val || '* Preencha o campo título',
            (val) =>
              val.length >= 3 ||
              'O campo título deve ter no mínimo 3 caracteres',
          ]"
          lazy-rules
        />
        <q-editor
          flat
          content-class="bg-amber-2"
          toolbar-text-color="white"
          toolbar-toggle-color="yellow-9"
          toolbar-bg="primary"
          v-model="form.note"
        />
        <div class="row">
          <q-btn to="/" label="Voltar" color="dark" class="col" push />
          <q-btn
            v-if="!$route.params.key"
            label="Salvar"
            type="submit"
            color="primary"
            push
            class="col"
          />
          <q-btn
            v-else
            label="Atualizar"
            type="submit"
            color="primary"
            push
            class="col"
          />
        </div>
      </q-form>
    </q-page>
  </q-page-container>
</template>

<script>
import db from "boot/database";
export default {
  name: "FormPage",
  data() {
    return {
      form: {
        title: "",
        note: "",
      },
      collection: "notes",
    };
  },
  mounted() {
    if (Object.entries(this.$route.params).length > 0) {
      this.form = this.$route.params;
    }
  },
  methods: {
    onSubmit() {
      if (this.form.key) {
        this.updateNote();
      } else {
        this.addNote();
      }
    },
    addNote() {
      try {
        db.collection(this.collection).add({
          title: this.form.title,
          note: this.form.note,
        });
        this.$q.notify({
          message: "Anotação criada com sucesso!",
          color: "secondary",
          timeout: 1500,
          icon: "check",
        });
        this.$refs.titleInput.resetValidation();
        this.onReset();
      } catch (error) {
        console.log(error);
      }
    },
    async updateNote() {
      try {
        await db
          .collection(this.collection)
          .doc(this.form.key)
          .update(this.form);
        this.$q.notify({
          message: "Anotação atualizada com sucesso!",
          color: "secondary",
          icon: "check",
        });
      } catch (error) {
        console.log(error);
      }
    },
    onReset() {
      this.form.title = "";
      this.form.note = "";
    },
  },
};
</script>
