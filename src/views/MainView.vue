<template>
    <div 
        id="modal_container"
        v-if="this.modalView"
    >
        <div class="content">
            <!-- Редактирование мероприятия -->
            <template
                v-if="this.timeEdit"
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
                <button class="red">Удалить</button>
                <button class="green">Экспортировать в файл</button>
                <button class="blue">Сохранить</button>
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
                <button class="blue">Редактировать мероприятие</button>
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

        <a href="/login" id="auth">Войти как организатор</a>
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
                
                logined: false,

                timeEdit: false,

                modalView: false
            }
        },

        methods: {
            selectMonth (index) {
                this.selectedMonth = index;
                this.updateMonthEvents();
            },

            selectTime (time) {
                console.log(time);

                this.selectedTime = time.busy ? time : Object.assign(time, {
                    organizerName: "",
                    eventMembers: [
                        {
                            name: ""
                        }
                    ],
                });

                this.timeEdit = !time.busy;
                this.modalView = true;
            },

            inputMember(e, index){
                const isLast = (this.selectedTime.eventMembers.length - 1) === index;
                
                if (e.target.value.length > 0 && isLast) {
                    this.selectedTime.eventMembers.push("");
                } else if (e.target.value.length === 0) {
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
            }
        }
    };
</script>

<style src="@/assets/styles/style.css"></style>