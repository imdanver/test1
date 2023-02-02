<template>
  <div class="app">
    <div class="content">
      <div class="header">
        <div @click="form = true" class="add">Добавить новый комментарий</div>
        <div v-if="comments.length" @click="sortDefault" class="all">Все комментарии</div>
        <div v-if="comments.length" @click="sortBy('name')" class="sort-by-name">Сортировать по имени</div>
        <div v-if="comments.length" @click="sortBy('email')" class="sort-by-email">Сортировать по email</div>
        <div v-if="comments.length" @click="sortBy('ts')" class="sort-by-date">Сортировать по дате</div>
      </div>
      <div class="messages">
        <app-comment v-for="item in page" :message="item" @form-on="formOn"></app-comment>
      </div>
      <div class="footer">
        <div v-if="pages" class="wrap">
          <div>
            <span @click="changePageNum('start')" class="material-icons">more_horiz</span>
          </div>
          <div>
            <span @click="changePageNum('minus')" class="material-icons">chevron_left</span>
          </div>
          <div>{{pageNum}}</div>
          <div>
            <span @click="changePageNum('plus')" class="material-icons">chevron_right</span>
          </div>
          <div>
            <span @click="changePageNum('end')" class="material-icons">more_horiz</span>
          </div>
        </div>
      </div>
      <app-form :form="form" :parent="parent" :level="level" @form-off="formOff"></app-form>
    </div>
  </div>
</template>

<script>

import AppComment from "./components/AppComment"
import AppForm from "./components/AppForm"

export default {
  name: 'App',
  components: {AppComment, AppForm},
  data() {
    return {
      ws: null,
      comments: [],
      messages: [],
      form: false,
      parent: '',
      level: 0,
      order: true,
      messagesCount: 25,
      pageNum: 1,
    }
  },
  mounted() {
    this.ws = new WebSocket(`ws://${process.env.VUE_APP_WEBSOCKET_SERVER_HOST}:${process.env.VUE_APP_WEBSOCKET_SERVER_PORT}`)
    this.ws.onmessage = this.onMessage
  },
  computed: {
    page() {
      const start = (this.pageNum - 1) * this.messagesCount
      const end = start + this.messagesCount
      return this.messages.slice(start, end)
    },
    pages() {
      return this.messages.length > this.messagesCount
    }
  },
  methods: {
    changePageNum(arg) {
      const maxPageNum = this.messages.length % this.messagesCount ?
              Math.trunc(this.messages.length / this.messagesCount) + 1 :
              Math.trunc(this.messages.length / this.messagesCount)

      if(arg === 'start') this.pageNum = 1
      else if(arg === 'minus') this.pageNum--
      else if(arg === 'plus') this.pageNum++
      else if(arg === 'end') this.pageNum = maxPageNum
      if(this.pageNum < 1) this.pageNum = 1
      if(this.pageNum > maxPageNum) this.pageNum = maxPageNum
    },
    formOn(parent, level) {
        this.parent = parent
        this.level = ++level
        this.form = true
    },
    formOff() {
        this.parent = ''
        this.level = 0
        this.form = false
    },
    onMessage(e) {
      this.comments = JSON.parse(e.data.toString())
      this.sortDefault()
    },
    sortBy(field) {
      const fn = (a, b) => {
        let A = a[field], B = b[field]
        if(field === 'ts') {
          A = +a[field]
          B = +b[field]
        }
        if(this.order) {
          if(A > B) return 1
          else if(A < B) return -1
          return 0
        }
        else {
          if(A < B) return 1
          else if(A > B) return -1
          return 0
        }
      }

      const comments = this.comments.filter(item => +item.level === 0)
      comments.sort(fn)
      this.messages = comments
      this.order = !this.order
      this.pageNum = 1
    },
    sortDefault() {
      let arr0 = [], i = 0
      while(true) {
        const res = this.comments.filter(item => +item.level === i)
        if(!res.length) break
        if(i === 0) arr0 = [...res]
        else {
          res.reverse()
          res.forEach(item => {
              const index = arr0.findIndex(el => +el.id === +item.parent)
              if(index !== -1) arr0.splice(+index + 1, 0, item)
          })
        }
        i++
      }
      this.comments = arr0
      this.messages = this.comments
      this.pageNum = 1
    }
  }
}

</script>

<style scoped>

  .app {
    display: flex;
    justify-content: center;
    flex: 1 0 100%;
    height: 100%;
    overflow: hidden;
    color: #303030;
    background: aquamarine;
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 100%;
    overflow: hidden;
  }

  .header {
    display: flex;
    justify-content: center;
    height: 40px;
    margin-bottom: 15px;
  }

  .header div {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 0 15px;
      margin-right: 15px;
      margin-bottom: 15px;
      cursor: default;
      border-radius: 5px;
      color: #B9FFE8;
      background: #29A67D;
  }

  .messages {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: auto;
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }

  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #B9FFE8;
  }

  .wrap div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    border-radius: 26px;
    margin-right: 7px;
    background: #29A67D;
    cursor: default;
  }

</style>
