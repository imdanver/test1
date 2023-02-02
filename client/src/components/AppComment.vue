<template>
    <div :key="message.id" class="message" :style="{'margin-left': `${15 + 20 * message.level}px`}">
        <div class="name-wrap">
            <div class="name">{{message.name}}</div>
            <div class="date">{{date}}</div>
        </div>
        <div class="msg">{{message.msg}}</div>
        <span v-if="message.ext || message.txt" @click="attachment = true" class="material-icons">attach_file</span>
        <div v-if="attachment" class="attachment-bg" :id="message.uid">
            <div class="attachment">
                <img v-if="message.ext" :src="src" alt="">
                <div v-else-if="message.txt" >{{message.txt}}</div>
                <span @click="attachment = false" class="material-icons close">close</span>
            </div>
        </div>
        <div class="answer" @click="onClick(message.id, message.level)">Ответить</div>
    </div>
</template>

<script>
    export default {
        name: "Comment",
        props: ['message'],
        data() {
            return {
                attachment: false
            }
        },
        computed: {
            src() {
                if(this.message.ext) {
                    const protocol = window.location.protocol, hostname = window.location.hostname, port = process.env.VUE_APP_SERVER_PORT
                    return `${protocol}//${hostname}:${port}/${this.message.uid}.${this.message.ext}`
                }
            },
            date() {
                const date = new Date(+this.message.ts)
                const localeDate = date.toLocaleString()
                return localeDate.replace(',', '')
            }
        },
        methods: {
            onClick(id, level) {
                this.$emit('form-on', id, level)
            },
        },
    }
</script>

<style scoped>

    .message {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        border-radius: 5px;
        margin-bottom: 15px;
        margin-right: 15px;
        padding: 5px;
        background: #77BFA8;
    }

    .message:first-child {
        margin-top: 15px;
    }

    .name-wrap {
        display: flex;
    }

    .name, .date, .msg, .answer {
        display: flex;
        padding: 5px;
    }

    .name {
        color: #0D6C4D;
        margin-right: 20px;
    }

    .date {
        font-size: 12px;
    }

    .attachment-bg {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: aquamarine;
    }

    .attachment {
        display: flex;
        position: relative;
        border: 1px solid #D8D8D8;
        box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
    }

    .attachment img {
        padding: 20px;
        background: white;
        overflow: auto;
    }

    .attachment div {
        width: 50vw;
        max-height: 90vh;
        min-height: 50vh;
        padding: 20px;
        background: white;
        overflow: auto;
    }

    .answer {
        cursor: default;
    }

    .material-icons {
        cursor: default;
    }

    .close {
        position: absolute;
        top: -40px;
        right: -40px;
    }

</style>