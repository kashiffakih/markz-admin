<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Chat</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/">Home</nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/seller/dashboard">Marketplace</nuxt-link></li>
                <li class="breadcrumb-item active">Chat</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="card chat-card">
            <div class="row no-gutters" style="height: 70vh;">
              <!-- Conversation list -->
              <div class="col-md-4 border-right d-flex flex-column" style="height:100%;">
                <div class="p-2 border-bottom">
                  <select v-model="filter" class="form-control form-control-sm" @change="loadConversations">
                    <option value="">All conversations</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div style="overflow-y:auto; flex:1;">
                  <div v-if="loadingList" class="text-center py-3"><i class="fas fa-spinner fa-spin"></i></div>
                  <div v-else-if="!conversations.length" class="text-center text-muted py-4">Koi conversation nahi</div>
                  <div
                    v-for="c in conversations" :key="c.id"
                    class="conv-item p-2 border-bottom" :class="{ active: activeId === c.id }"
                    @click="openConversation(c)"
                  >
                    <div class="d-flex justify-content-between">
                      <strong class="text-truncate">{{ title(c) }}</strong>
                      <span v-if="unreadOf(c) > 0" class="badge badge-danger ml-1">{{ unreadOf(c) }}</span>
                    </div>
                    <small class="text-muted d-block text-truncate">{{ c.product ? c.product.name + ' · ' : '' }}{{ c.last_message_preview || 'No messages yet' }}</small>
                    <small class="text-muted">{{ ago(c.last_message_at) }} <span v-if="c.status === 'closed'" class="badge badge-secondary">closed</span></small>
                  </div>
                </div>
              </div>

              <!-- Thread -->
              <div class="col-md-8 d-flex flex-column" style="height:100%;">
                <div v-if="!active" class="m-auto text-muted"><i class="far fa-comments fa-3x d-block text-center mb-2"></i>Conversation select karo</div>
                <template v-else>
                  <div class="p-2 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ title(active) }}</strong>
                      <small v-if="active.product" class="text-muted d-block">Product: {{ active.product.name }}</small>
                    </div>
                    <button v-if="active.status !== 'closed'" class="btn btn-sm btn-outline-secondary" @click="closeConversation">Close</button>
                    <span v-else class="badge badge-secondary">Closed</span>
                  </div>
                  <div ref="thread" class="p-3" style="overflow-y:auto; flex:1; background:#f4f6f9;">
                    <div v-for="m in messages" :key="m.id" class="d-flex mb-2" :class="m.sender_type === side ? 'justify-content-end' : 'justify-content-start'">
                      <div class="bubble" :class="m.sender_type === side ? 'mine' : 'theirs'">
                        <small v-if="m.sender_type !== side" class="d-block text-muted">{{ m.sender_type }}</small>
                        <div style="white-space:pre-wrap;">{{ m.body }}</div>
                        <small class="d-block text-right opacity-75">{{ time(m.created_at) }}</small>
                      </div>
                    </div>
                  </div>
                  <div class="p-2 border-top">
                    <form class="d-flex" @submit.prevent="send">
                      <input v-model="draft" class="form-control mr-2" maxlength="2000" :disabled="active.status === 'closed'"
                             :placeholder="active.status === 'closed' ? 'Conversation closed' : 'Message likho...'" />
                      <button class="btn btn-primary" :disabled="sending || !draft.trim() || active.status === 'closed'">
                        <i class="fas fa-paper-plane"></i>
                      </button>
                    </form>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import BackButton from "~/components/BackButton";

export default {
  components: { BackButton },
  data() {
    return {
      conversations: [], loadingList: false, filter: "",
      active: null, activeId: null, side: "seller", as: "seller",
      messages: [], lastId: 0, draft: "", sending: false,
      pollTimer: null, listTimer: null,
    };
  },
  mounted() {
    this.loadConversations();
    this.listTimer = setInterval(this.loadConversations, 15000);
    this.pollTimer = setInterval(this.pollMessages, 5000);
  },
  beforeDestroy() {
    clearInterval(this.listTimer);
    clearInterval(this.pollTimer);
  },
  methods: {
    async loadConversations() {
      if (!this.conversations.length) this.loadingList = true;
      try {
        const params = {};
        if (this.filter) params.status = this.filter;
        const res = await this.$axios.get("chat/conversations", { params });
        this.conversations = res.data.data || [];
        this.as = res.data.as || "seller";
      } catch (e) {
        this.conversations = [];
      }
      this.loadingList = false;
    },
    title(c) {
      if (this.as === "customer") return c.company ? c.company.name : "Seller";
      const cust = c.customer ? ((c.customer.first_name || "") + " " + (c.customer.last_name || "")).trim() : "Customer";
      return this.as === "admin" && c.company ? cust + " → " + c.company.name : cust;
    },
    unreadOf(c) {
      return this.as === "seller" ? c.seller_unread : this.as === "customer" ? c.customer_unread : 0;
    },
    async openConversation(c) {
      this.active = c; this.activeId = c.id; this.messages = []; this.lastId = 0;
      await this.fetchMessages(true);
      this.loadConversations();
    },
    async fetchMessages(initial) {
      if (!this.activeId) return;
      try {
        const params = {};
        if (!initial && this.lastId) params.after_id = this.lastId;
        const res = await this.$axios.get(`chat/conversations/${this.activeId}/messages`, { params });
        this.side = res.data.side;
        if (res.data.conversation) this.active = res.data.conversation;
        const incoming = res.data.messages || [];
        if (initial) this.messages = incoming;
        else if (incoming.length) this.messages = this.messages.concat(incoming);
        if (this.messages.length) this.lastId = this.messages[this.messages.length - 1].id;
        if (initial || incoming.length) this.scrollDown();
      } catch (e) {}
    },
    pollMessages() { if (this.activeId && !this.sending) this.fetchMessages(false); },
    async send() {
      const body = this.draft.trim();
      if (!body) return;
      this.sending = true;
      try {
        await this.$axios.post(`chat/conversations/${this.activeId}/messages`, { body });
        this.draft = "";
        await this.fetchMessages(false);
        this.loadConversations();
      } catch (e) {
        this.$toast.error("Message send nahi hua");
      }
      this.sending = false;
    },
    async closeConversation() {
      if (!confirm("Conversation close karni hai?")) return;
      try {
        await this.$axios.post(`chat/conversations/${this.activeId}/close`);
        this.active.status = "closed";
        this.loadConversations();
      } catch (e) { this.$toast.error("Close nahi hui"); }
    },
    scrollDown() {
      this.$nextTick(() => { const el = this.$refs.thread; if (el) el.scrollTop = el.scrollHeight; });
    },
    ago(d) { return d ? moment(d).fromNow() : ""; },
    time(d) { return d ? moment(d).format("DD MMM, hh:mm A") : ""; },
  },
};
</script>

<style scoped>
.conv-item { cursor: pointer; }
.conv-item:hover { background: #f1f3f5; }
.conv-item.active { background: #e7f1ff; }
.bubble { max-width: 70%; padding: 6px 10px; border-radius: 10px; }
.bubble.mine { background: #007bff; color: #fff; }
.bubble.mine small { color: #dbe9ff !important; }
.bubble.theirs { background: #fff; border: 1px solid #dee2e6; }
</style>
