<template>
    <div class="modal-overlay" v-if="form">
        <div class="modal">
            <span @click="toDefault" class="material-icons close">close</span>
            <form enctype="multipart/form-data" @submit.prevent>
                <label for="text">Имя</label>
                <input type="text" id="text" v-model="text">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email">
                <label for="url">Домашняя страница</label>
                <input type="url" id="url" v-model="url">
                <label for="captcha">Капча (введите символы с изображения)</label>
                <div class="captcha">
                    <input type="text" id="captcha" v-model="captcha">
                    <img src="../assets/images/captcha.jpg" alt="">
                </div>
                <label for="textarea">Текст сообщения</label>
                <textarea id="textarea" cols="30" rows="10" v-model="textarea"></textarea>
                <div class="tags">
                    <div @click="pasteTag(0)">[i]</div>
                    <div @click="pasteTag(1)">[strong]</div>
                    <div @click="pasteTag(2)">[code]</div>
                    <div @click="pasteTag(3)">[a]</div>
                </div>
                <label for="file">Загрузить файл</label>
                <input type="file" id="file" @change="upload($event)"/>
                <button @click="onSubmit">Отправить</button>
                <div class="errors">
                    <div v-for="error in errors" :key="error" class="error">{{error}}</div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import sanitizeHtml from 'sanitize-html'

    export default {
        name: "AppForm",
        props: ['form', 'parent', 'level'],
        data() {
            return {
                text: '',
                email: '',
                url: '',
                captcha: '',
                textarea: '',
                file: '',
                errors: [],
                tags: ['<i></i>', '<strong></strong>', '<code></code>', '<a href="" title=""></a>'],
            }
        },
        mounted(){
            this.ws = new WebSocket(`ws://${process.env.VUE_APP_WEBSOCKET_SERVER_HOST}:${process.env.VUE_APP_WEBSOCKET_SERVER_PORT}`)
        },
        methods: {
            pasteTag(i) {
                this.textarea = `${this.textarea}${this.tags[i]}`
            },
            async onSubmit() {

                this.errors.length = 0

                if(!this.text) this.errors.push('Поле "Имя" должно быть заполнено')
                else if(!/^[a-zA-Z0-9]+$/.test(this.text)){
                    this.errors.push('Поле "Имя" может содержать только цифры и буквы латинского алфавита')
                }

                if(!this.email) this.errors.push('Поле "Email" должно быть заполнено')
                else if(!/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/.test(this.email)) {
                    this.errors.push('Поле "Email" должно иметь формат email')
                }

                if(this.url && !/^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(this.url)) {
                    this.errors.push('Поле "Домашняя страница" должно иметь формат url')
                }

                if(!this.captcha) this.errors.push('Поле "Капча" должно быть заполнено')
                else if(this.captcha !== 'captcha246') this.errors.push('Поле "Капча" заполнено неправильно')

                if(!this.textarea) this.errors.push('Поле "Текст сообщения" должно быть заполнено')
                else if(!/^[-?!,.<>a-z0-9а-яё@:%._+~#=/"\s”]*$/gmi.test(this.textarea)) {
                    this.errors.push('Поле "Текст сообщения" содержит недопустимый символ')
                }

                if(this.file) {
                    const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain']
                    if(!fileTypes.includes(this.file.type)) this.errors.push('Разрешенные типы файлов: .jpg, .png, .gif, .txt')
                    else if(this.file.type === 'text/plain' && this.file.size > 100000)  this.errors.push('Размер текстового файла не должен быть более 100кб')
                }

                if(!this.errors.length) {

                    this.textarea = sanitizeHtml(this.textarea, {
                        allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
                        allowedAttributes: {
                            'a': ['href', 'title']
                        }
                    })

                    if(this.file) {
                        if(this.file.type === "text/plain") {
                            const reader = new FileReader()
                            reader.addEventListener('load', e => {
                                const uid = `user${Date.now()}`, txt = e.target.result, ext = ''
                                this.send(uid, txt, ext)
                            })
                            reader.readAsText(this.file)
                        }
                        else {
                            const uid = `user${Date.now()}`, txt = '', ext = this.file.name.split('.').pop()
                            this.send(uid, txt, ext)
                            const formData = new FormData()
                            formData.append('file', this.file, `${uid}.${ext}`)
                            await axios.post(`${window.location.protocol}//${window.location.hostname}:${process.env.VUE_APP_SERVER_PORT}/ajax`,
                                formData, {headers: {'Content-Type': 'multipart/form-data'}})
                        }
                    }
                    else {
                        const uid = `user${Date.now()}`, txt = '', ext = ''
                        this.send(uid, txt, ext)
                    }

                    this.toDefault()
                }
            },
            send(uid, txt, ext) {
                const obj = {
                    uid,
                    parent: this.parent,
                    level: this.level,
                    name: this.text,
                    email: this.email,
                    url: this.url,
                    msg: this.textarea,
                    txt,
                    ext,
                    ts: Date.now(),
                }
                this.ws.send(JSON.stringify(obj))
            },
            toDefault() {
                this.text = ''
                this.email = ''
                this.url = ''
                this.captcha = ''
                this.textarea = ''
                this.$emit('form-off')
            },
            upload(e) {
                this.file = e.target.files[0]
            }
        }
    }
</script>

<style scoped>

    .modal-overlay {
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

    .modal {
        display: flex;
        position: relative;
        width: 500px;
        height: 800px;
        padding: 30px 30px 0;
        background: #77BFA8;
        color: #303030;
        border-radius: 5px;
    }

    .close {
        position: absolute;
        top: -40px;
        right: -40px;
        cursor: default;
    }

    form {
        display: flex;
        flex-direction: column;
        flex: 1 0 100%;
        height: 100%;
        overflow: hidden;
    }

    input[type="text"],
    input[type="email"],
    input[type="url"],
    input[type="file"],
    button {
        margin-bottom: 15px;
    }

    textarea {
        margin-bottom: 5px;
        background: #F0F0F0;
        border-radius: 5px;
        padding: 10px;
    }

    input[type="text"],
    input[type="email"],
    input[type="url"] {
        height: 30px;
        background: #F0F0F0;
        border-radius: 5px;
        padding: 0 10px;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        margin-top: 15px;
        background: #29A67D;
        border-radius: 5px;
    }

    .captcha {
        display: flex;
        height: 30px;
        margin-bottom: 15px;
    }

    .captcha input {
        display: flex;
        height: 30px;
        margin-bottom: 15px;
        border-radius: 5px 0 0 5px;
    }

    .tags {
        display: flex;
        margin-bottom: 15px;
    }

    .tags div {
        margin-left: 7px;
        cursor: default;
    }

    .errors {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
    }

    .error {
        display: flex;
        padding: 5px 10px;
        font-size: 12px;
        margin-bottom: 5px;
        background: #FFBF9F;
        color: #A65329;
    }

</style>