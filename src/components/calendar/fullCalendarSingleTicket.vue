<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header :current-month="currentMonth" :first-day="firstDay" :locale="locale" @change="emitChangeMonth">

      <div slot="header-left">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item style="width: 100px;">
            <el-select v-model="yearNow" placeholder="请选择"  @change="selectDate" size="small">
              <el-option
                v-for="year in years"
                :key="year.key"
                :label="year.key"
                :value="year.val">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 80px;">
            <el-select v-model="monthNow" placeholder="请选择"  @change="selectDate" size="small">
              <el-option
                v-for="month in months"
                :key="month.key"
                :label="month.key"
                :value="month.val">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <slot name="fc-header-left">
        </slot>
      </div>
      <div slot="header-right">
        <slot name="fc-header-right">
        </slot>
      </div>
    </fc-header>
    <!-- body display date day and events -->
    <div class="full-calendar-body">
      <div class="weeks">
        <strong class="week" v-for="dayIndex in 7">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div class="dates" ref="dates">
        <div class="dates-bg">
          <div class="week-row" v-for="week in currentDates">
            <div class="day-cell" v-for="day in week" :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth, 'oldDays' : day.date._d < timeNow}">
              <p class="day-number">{{ day.monthDay }}</p>
            </div>
          </div>
        </div>
        <!-- absolute so we can make dynamic td -->
        <div class="dates-events">
          <div class="events-week" v-for="week in currentDates">
            <div class="events-day" v-for="day in week" track-by="$index" :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth, 'oldDays' : day.date._d < timeNow}" @click.stop="dayClick(day.date, $event, day.isCurMonth)">
              <!--<p class="day-number">{{day.monthDay}}</p>-->
              <div class="event-box">
                <p v-if="day.events.length > eventLimit" class="more-link" @click.stop="selectThisDay(day, $event)">
                  <strong>结算价：</strong>{{day.events[day.events.length -1].settle_price}} <br>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- full events when click show more -->
        <div class="more-events" v-show="showMore" :style="{left: morePos.left + 'px', top: morePos.top + 'px'}">
          <div class="more-header">
            <span class="title">{{ moreTitle(selectDay.date) }}报价</span>
            <span class="close" @click.stop="closeShowMore">x</span>
          </div>
          <div class="more-body">
            <ul class="body-list">
              <slot name="body-card-form"></slot>
            </ul>
          </div>
        </div>
        <slot name="body-card">
        </slot>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import dateFunc from './dateFunc'
  import moment from 'moment'
  import EventCard from './eventCard.vue'

  export default {
    props: {
      events: {
        type: Array,
        default: [],
        showType: ''
      },
      locale: {
        type: String,
        default: 'en'
      },
      firstDay: {
        type: Number | String,
        validator (val) {
          let res = parseInt(val)
          return res >= 0 && res <= 6
        },
        default: 0
      }
    },
    components: {
      'event-card': EventCard,
      'fc-header': require('./header')
    },
    mounted () {
      this.emitChangeMonth(this.currentMonth)
    },
    data () {
      return {
        currentMonth: moment().startOf('month'),
        isLismit: true,
        eventLimit: 0,
        morePos: {
          top: 0,
          left: 0
        },
        selectDay: {},
        monthNow: moment().month(),
        yearNow: moment().year(),
        timeNow: moment()._d - 8.64e7
      }
    },
    computed: {
      currentDates () {
        return this.getCalendar()
      },
      months () {
        var months = []
        for (var i = 0; i < 12; i++) {
          var obj = {
            key: i + 1,
            val: i
          }
          months.push(obj)
        }
        return months
      },
      years () {
        var years = []
        for (var i = 2017; i < 2020; i++) {
          var obj = {
            key: i,
            val: i
          }
          years.push(obj)
        }
        return years
      },
      showMore () {
        return this.$store.getters.getCardShowStatus
      }
    },
    methods: {
      selectDate () {
        var newMonth = moment().year(this.yearNow).month(this.monthNow).startOf('month')
        this.emitChangeMonth(newMonth)
      },
      emitChangeMonth (firstDayOfMonth) {
        this.currentMonth = firstDayOfMonth
        let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay)
        let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay)
        this.$emit('changeMonth', start, end, firstDayOfMonth)
      },
      moreTitle (date) {
        if (!date) return ''
        return moment(date).format('ll')
      },
      getCalendar () {
        let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay)
        let calendar = []
        for (let perWeek = 0; perWeek < 6; perWeek++) {
          let week = []
          for (let perDay = 0; perDay < 7; perDay++) {
            week.push({
              monthDay: monthViewStartDate.date(),
              isToday: monthViewStartDate.isSame(moment(), 'day'),
              isCurMonth: monthViewStartDate.isSame(this.currentMonth, 'month'),
              weekDay: perDay,
              date: moment(monthViewStartDate),
              events: this.slotEvents(monthViewStartDate)
            })
            monthViewStartDate.add(1, 'day')
          }
          calendar.push(week)
        }
        return calendar
      },
      slotEvents (date) {
        let thisDayEvents = this.events.filter(day => {
          let st = moment(day.start)
          let ed = moment(day.end ? day.end : st)
          return date.isBetween(st, ed, null, '[]')
        })
        thisDayEvents.sort((a, b) => {
          if (!a.cellIndex) {
            return 1
          }
          if (!b.cellIndex) {
            return -1
          }
          return a.cellIndex - b.cellIndex
        })
        for (let i = 0; i < thisDayEvents.length; i++) {
          thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1)
          thisDayEvents[i].isShow = true
          if (thisDayEvents[i].cellIndex === i + 1 || i > 2) {
            continue
          }
          thisDayEvents.splice(i, 0, {
            title: 'holder',
            cellIndex: i + 1,
            start: date.format(),
            end: date.format(),
            isShow: false
          })
        }
        return thisDayEvents
      },
      selectThisDay (day, jsEvent) {
        if (day.date._d.getTime() < this.timeNow) {
          return false
        }
        this.selectDay = day
        this.$store.commit('updateCardShowStatus', true)
        this.morePos = this.computePos(event.target)
        this.morePos.top -= 100
        if (this.morePos.top >= 700) {
          this.morePos.top -= 300
        }
        if (this.morePos.top >= 480) {
          this.morePos.top -= 200
        }
        let events = day.events.filter(item => {
          return item.isShow === true
        })
        this.$emit('moreClick', day.date, events, jsEvent)
      },
      computePos (target) {
        let eventRect = target.getBoundingClientRect()
        let pageRect = this.$refs.dates.getBoundingClientRect()
        return {
          left: eventRect.left - pageRect.left,
          top: eventRect.top + eventRect.height - pageRect.top
        }
      },
      dayClick (day, jsEvent, isCurMonth) {
        if (day._d.getTime() < this.timeNow || !isCurMonth) {
          return false
        }
        this.selectDay = {date: day}
        this.$store.commit('updateCardShowStatus', true)
        this.morePos = this.computePos(event.target)
        this.morePos.top -= 100
        var events = [{
          settlement: 0,
          distribution: 0,
          inventoryPooling: 0,
          product_id: null,
          price_date: day.format('YYYY-MM-DD')
        }]
        this.$emit('moreClick', day.date, events, jsEvent)
        // this.$emit('dayClick', day, jsEvent)
      },
      eventClick (event, jsEvent) {
        if (!event.isShow) return
        jsEvent.stopPropagation()
        let pos = this.computePos(jsEvent.target)
        this.$emit('eventClick', event, jsEvent, pos)
      },
      closeShowMore () {
        this.$store.commit('updateCardShowStatus', false)
      }
    },
    filters: {
      localeWeekDay (weekday, firstDay, locale) {
        firstDay = parseInt(firstDay)
        const localMoment = moment().locale(locale)
        return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7]
      }
    }
  }

</script>
<style lang="scss" scoped>
  .comp-full-calendar {
    // font-family: "elvetica neue", tahoma, "hiragino sans gb";
    padding: 20px;
    background: #fff;
    max-width: 860px;
    margin: 0 auto;
    ul,
    p {
      margin: 0;
      padding: 0;
    }
  }

  .full-calendar-body {
    margin-top: 20px;
    .weeks {
      display: flex;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      border-left: 1px solid #e0e0e0;
      .week {
        flex: 1;
        text-align: center;
        border-right: 1px solid #e0e0e0;
      }
    }
    .dates {
      position: relative;
      .week-row {
        // width: 100%;
        // position:absolute;
        border-left: 1px solid #e0e0e0;
        display: flex;
        .day-cell {
          flex: 1;
          min-height: 112px;
          padding: 4px;
          border-right: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          background-color: #fff;
          .day-number {
            text-align: right;
          }
          &.today {
            background-color: #fff;
          }
          &.oldDays {
            background-color: #EFF2F7;
          }
          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, .24);
            }
          }
        }
      }
      .dates-events {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        .events-week {
          display: flex;
          .events-day {
            cursor: pointer;
            flex: 1;
            min-height: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 1px;
            .day-number {
              text-align: right;
              opacity: 0;
            }
            &.not-cur-month {
              cursor: not-allowed;
              .day-number {
                color: rgba(0, 0, 0, .24);
              }
            }
            .event-box {
              .event-item {
                cursor: pointer;
                font-size: 12px;
                background-color: #C7E6FD;
                margin-bottom: 2px;
                color: rgba(0, 0, 0, .87);
                padding: 0 0 0 4px;
                height: 18px;
                line-height: 18px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &.is-start {
                  margin-left: 4px;
                  // border-top-left-radius:4px;
                  // border-bottom-left-radius:4px;
                }
                &.is-end {
                  margin-right: 4px;
                  // border-top-right-radius:4px;
                  // border-bottom-right-radius:4px;
                }
                &.is-opacity {
                  opacity: 0;
                }
              }
              .more-link {
                cursor: pointer;
                // text-align: right;
                padding-left: 8px;
                padding-right: 2px;
                color: rgba(0, 0, 0, .38);
                font-size: 14px;
              }
            }
          }
        }
      }
      .more-events {
        position: absolute;
        width: 300px;
        z-index: 2;
        border: 1px solid #eee;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
        .more-header {
          background-color: #20A0FF;
          padding: 5px;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #fff;
          text-align: center;
          .title {
            flex: 1;
          }
          .close {
            margin-right: 2px;
            cursor: pointer;
            font-size: 16px;
          }
        }
        .more-body {
          overflow: hidden;
          .body-list {
            padding: 5px;
            overflow: auto;
            background-color: #fff;
            li {
              margin: 10px 0;
              label {
                font-size: 14px;
              }
            }
            .body-item {
              cursor: pointer;
              font-size: 12px;
              background-color: #C7E6FD;
              margin-bottom: 2px;
              color: rgba(0, 0, 0, .87);
              padding: 0 0 0 4px;
              height: 18px;
              line-height: 18px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            input {
              width: 100%;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
          }
        }
      }
    }
  }

  .readonlyIpt {
    cursor: not-allowed;
  }
  .el-form-item{
    margin-bottom: initial;
  }
  .oldDays {
    cursor: not-allowed!important;
    .more-link {
      cursor: not-allowed!important;
    }
  }
  .event-box, .more-link {
    height: 100%;
  }
</style>
