<template>
    <div 
        id="modal_container"
        v-if="this.modalView"
    >
        <div class="content">
            <template v-if="this.timeModal">
                <!-- Редактирование мероприятия -->
                <template
                    v-if="this.timeEdit && this.isLogined()"
                >
                    <h2>Редактирование собраний</h2>

                    <label>Дата и время</label>
                    <p>{{selectedTime.date}} {{selectedTime.time}}</p>

                    <label>Организатор</label>
                    <input 
                        type="text" 
                        placeholder="ФИО организатора" 
                        :class="{
                            empty: selectedTime.organizerName === ''
                        }"
                        v-model="selectedTime.organizerName"
                    >

                    <label>Участники</label>
                    <input
                        v-for="(member, index) in selectedTime.eventMembers"
                        :key="index"
                        placeholder="ФИО участника"
                        @input="(e) => {inputMember(e, index)}"
                        :class="{
                            empty: member.name === ''
                        }"
                        v-model="selectedTime.eventMembers[index].name"
                    />

                    <label>Действия</label>
                    <button class="red" v-if="selectedTime.busy">Удалить</button>
                    <button class="green" v-if="selectedTime.busy">Экспортировать в файл</button>
                    <button class="blue" 
                    @click="editEvent"
                    v-if="selectedTime.busy"
                    >Сохранить</button> 
                    <button class="blue" 
                    @click="createEvent"
                    v-else
                    >Сохранить</button> 

                </template>

                <!-- Просмотр мероприятия -->
                <template
                    v-else
                >
                    <h2>Просмтр собраний</h2>

                    <label>Дата и время</label>
                    <p>{{selectedTime.date}} {{selectedTime.time}}</p>

                    <label>Организатор</label>
                    <p>{{selectedTime.organizerName}}</p>

                    <label>Участники</label>
                    <p
                        v-for="(member, index) in selectedTime.eventMembers"
                        :key="index"
                        v-text="member.name"
                    />

                    <label>Действия</label>
                    <button class="green" @click="exportEvent(selectedTime.eventId)">Экспортировать в файл</button>
                    <button class="blue" v-if="this.isLogined()" @click="timeEdit = true">Редактировать мероприятие</button>
                </template>
            </template>

            <template v-if="this.tableModal">
                <h2>Импорт таблицы</h2>
                <input type="file" id="import_table_input">
                <button class="blue" @click="importEvents">Импортировать</button>
            </template>
        </div>

        <div class="background" @click="this.modalView = false"/>
    </div>

    <header>
        <img class="logotype" src="@/assets/images/logotype.svg" alt="">

        <nav>
            <ul>
                <li 
                    v-for="(name, index) in months"
                    :key="index"
                    :class="{
                        selected: selectedMonth === index
                    }"
                    @click="selectMonth(index)"
                    v-text="name"
                />
            </ul>
        </nav>

        <p id="auth">
            <a href="/login" v-if="!this.isLogined()">Войти как организатор</a>
            <a href="#" @click="openImportWindow()" v-if="this.isLogined()">Импортировать таблицу</a>
        </p>
    </header>

    <main>
        <div class="table">
            <div 
                class="row"
                v-for="(day, dayIndex) in monthEvents"
                :key="dayIndex"
            >
                <div class="cell primary">
                    {{dayIndex + 1 < 10 ? "0" + (dayIndex + 1) : dayIndex + 1 }}
                </div>

                <div 
                    v-for="(time, timeIndex) in monthEvents[dayIndex]"
                    class="cell"
                    :class="{
                        busy: time.busy
                    }"
                    :key="timeIndex"
                    v-text="time.time"
                    @click="selectTime(time)"
                />
            </div>
        </div>
    </main>
</template>

<script>
    import Api from "../api";

    export default {
        name: "MainView",

        mounted () {
            this.getAccount();
            this.updateMonthEvents();
        },

        data () {
            return {
                months: [
                    "Январь",
                    "Февраль",
                    "Март",
                    "Апрель",
                    "Май",
                    "Июнь",
                    "Июль",
                    "Август",
                    "Сентябрь",
                    "Октябрь",
                    "Ноябрь",
                    "Декабрь",
                ],

                selectedMonth: 0,

                monthEvents: [],

                selectedTime: {},

                timeEdit: false,
                timeModal: false,
                tableModal: false,
                modalView: false,

                account: {}
            }
        },

        methods: {
            getAccount () {
                const interval = setInterval(
                    () => {
                        const token = localStorage.getItem("token");
                        
                        if (token) {
                            Api.account.get(token).then(({account}) => {
                                this.account = account;
                                clearInterval(interval);
                            });
                        }
                    }, 
                    500
                )
            },

            isLogined() {
                return Object.keys(this.account).length > 0;
            },

            selectMonth (index) {
                this.selectedMonth = index;
                this.updateMonthEvents();
            },

            selectTime (time) {
                if (!this.isLogined() && !time.busy) {
                    return alert("На выбранное время не запланировано мероприятие");
                }

                this.selectedTime = time.busy ? time : Object.assign(time, {
                    organizerName: "",
                    eventMembers: [
                        {
                            name: ""
                        }
                    ],
                });

                this.timeEdit = !time.busy && this.account !== {};
                this.tableModal = false;
                this.timeModal = true;
                this.modalView = true;
            },

            inputMember(e, index){
                
                
                if (e.target.value.length > 0 && (this.selectedTime.eventMembers.length - 1) === index) {
                    this.selectedTime.eventMembers.push({name:""});
                    console.log(this.selectedTime.eventMembers)
                } else if (e.target.value.length === 0) {
                    console.log("пошел нахуй");
                    this.selectedTime.eventMembers.splice(index, 1);
                }
            },

            updateMonthEvents () {
                Api.event.getMonthEvents(this.selectedMonth + 1, (new Date()).getFullYear()).then(monthEvents => {
                    this.monthEvents = monthEvents;
                });
            },

            exportEvent (eventIndex) {
                Api.event.exportTable(eventIndex);
            },

            openImportWindow () {
                this.timeModal = false;
                this.tableModal = true;
                this.modalView = true;
            },

            importEvents () {
                const file = document.querySelector("#import_table_input").files[0];
                if (file) {
                    Api.event.importTable(file).then(() => {
                        this.updateMonthEvents();
                        this.tableModal = false;
                        this.modalView = false;
                    });
                }
            },
            createEvent(){
                const organizerName = this.selectedTime.organizerName.trim();
                const dateId = this.selectedTime.dateId;
                const time = this.selectedTime.time.trim();
                const eventMembers = [];
                for(let member of this.selectedTime.eventMembers){
                    if(member.name.trim()==='') continue;
                    eventMembers.push(member.name.trim());
                }
                Api.event.create(organizerName,time,dateId,eventMembers).then(()=>{
                    this.updateMonthEvents();
                    this.timeModal = false;
                    this.tableModal = false;
                    this.modalView = false;
                })
            },
            editEvent(){
                const eventMemberId = [];
                const name = [];
                for(let member of this.selectedTime.eventMembers){
                    if(member.name.trim()==='') continue;
                    name.push(member.name.trim());
                }
            console.log();
            Api.eventMember.update(eventMemberId,name)
            }
            
        }
    };
</script>

<style src="@/assets/styles/style.css"></style>