<template>
    <div style="width: 100%">
        <div style="display: flex;align-items: flex-start;justify-content: space-between;width: 100%">
            <div id="clockinvisual"></div>
            <div id="appattvisual"></div>
            <div class="calendar">
                <div class="choose_year">
                    <div class="icon" @click="chooseYears(-1)"><i class="fa fa-angle-double-left"></i></div>
                    <div class="icon" @click="chooseMonth(-1)"><i class="fa fa-angle-left"></i></div>
                    <div class="date">{{currenDate}}</div>
                    <div class="icon" @click="chooseMonth(1)"><i class="fa fa-angle-right"></i></div>
                    <div class="icon" @click="chooseYears(1)"><i class="fa fa-angle-double-right"></i></div>
                </div>
                <div class="days_area">
                    <div class="day week" v-for="week in weeks" :key="week">{{week}}</div>
                    <div class="day" :class="{'holiday': day.status != 0&&day.status!=2,'choose_day' : day.gregorian === today}"
                         @click="chooseThisDay(day.gregorian)" v-for="(day, index) in days" :key="index">
                        <p>{{day.gregorian}}</p>
                        <span>{{day.lunar}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex;align-items: flex-start;justify-content: space-between;width: 100%">
            <div id="empsalvisual" style="width: 70%"></div>
            <div id="empstavisual" style="width: 30%"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "WorkBench",
        data () {
            return {
                year: 0,
                month: 0,
                today: 0,
                days: [],
                weeks: ['日','一', '二', '三', '四', '五', '六'],
                clockindatas: [],
                appattdatas: [],
                empstadatas: [],
                empsaldatas: []
            }
        },
        computed: {
            currenDate(){
                const time = this.moment().set({'year': this.year, 'month': this.month, 'date': 1});
                return this.moment(time).format('YYYY-MM');
            }
        },
        watch: {
            currenDate(val){
                this.getRequest("/work/bench/getholidays/?daterange=" +
                    this.moment(val).startOf('month').format('YYYY-MM-DD') + "," + this.moment(val).endOf('month').format('YYYY-MM-DD')).then(resp => {
                    if (resp) {
                        // 获取当前月份所有公历日期及其农历日期
                        this.days = [];
                        const time = this.moment(val).startOf('month');
                        for (let i = 0; i < time.day(); i++) {
                            this.days.push({gregorian: '', lunar: '',status: ''})
                        }
                        for (let i = 1; i <= this.moment(val).endOf('month').date(); i++) {
                            this.days.push({gregorian: i, lunar: this.getLunarDay(this.year, this.month+1, i), status: resp[i-1]})
                        }
                    }
                });
            }
        },
        created() {
            this.getClockinVisual();
            this.getAppattVisual();
            this.getEmpstaVisual();
            this.getEmpsalVisual();
        },
        mounted () {
            this.year = this.moment().year();
            this.month = this.moment().month();
            this.today = this.moment().date();
        },
        methods: {
            chooseYears(state) { // 改变年份
                this.year += state;
                this.today = 1;
            },
            chooseMonth(state) { // 改变月份
                this.month += state;
                this.today = 1;
                if (this.month < 0) {
                    this.month = 11;
                    this.chooseYears(-1)
                } else if (this.month > 11) {
                    this.month = 1;
                    this.chooseYears(1)
                }
            },
            chooseThisDay(day) { // 选择某天，主要是考虑可以当时间选择器用
                if (day > 0) {
                    this.today = day
                }
            },
            getLunarDay(solarYear, solarMonth, solarDay) { // 拷贝别人又自己调整过的获取农历日期的代码，想要原来的代码估计百度一下就有了
                const madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                // const tgString = '甲乙丙丁戊己庚辛壬癸'
                // const dzString = '子丑寅卯辰巳午未申酉戌亥'
                const numString = '一二三四五六七八九十';
                const monString = '正二三四五六七八九十冬腊';
                const CalendarData = [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95];
                if (!(solarYear < 1921 || solarYear > 2020)) {
                    solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
                    const timeArr = [solarYear, solarMonth, solarDay];
                    let TheDate = (timeArr.length !== 3) ? new Date() : new Date(timeArr[0], timeArr[1], timeArr[2]);
                    let total, m, n, k;
                    let isEnd = false;
                    let theDateYear = TheDate.getFullYear();
                    total = (theDateYear - 1921) * 365 + Math.floor((theDateYear - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
                    if (theDateYear % 4 === 0 && TheDate.getMonth() > 1) {
                        total++
                    }
                    for (m = 0; ; m++) {
                        k = (CalendarData[m] < 0xfff) ? 11 : 12;
                        for (n = k; n >= 0; n--) {
                            if (total <= this.getBit(CalendarData[m], n)) {
                                isEnd = true;
                                break;
                            }
                            total = total - this.getBit(CalendarData[m], n)
                        }
                        if (isEnd) {
                            break;
                        }
                    }
                    let cMonth, cDay; // cYear,
                    // cYear = 1921 + m
                    cMonth = k - n + 1;
                    cDay = total;
                    if (k === 12) {
                        if (cMonth === Math.floor(CalendarData[m] / 0x10000) + 1) {
                            cMonth = 1 - cMonth
                        }
                        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                            cMonth--
                        }
                    }
                    // let run = ''
                    let cDayStr = numString.charAt(cDay - 1);
                    /* if (cMonth < 1) {
                      run = '(闰)'
                    } */
                    if (cDay % 10 !== 0 || cDay === 10) {
                        cDayStr = numString.charAt((cDay - 1) % 10)
                    }
                    return cDay === 1 ? monString.charAt(cMonth - 1) + '月' : (cDay < 11 ? '初' : (cDay < 20 ? '十' : (cDay < 30 ? '廿' : '三十'))) + cDayStr // tgString.charAt((cYear - 4) % 10) + dzString.charAt((cYear - 4) % 12) + '年 ' + run + monString.charAt(cMonth - 1) + '月' +
                }
            },
            getBit(m, n) { // 也是拷贝的，不是很明白这段代码干嘛的，不过很明显是处理二进制数据的
                return 29 + ((m >> n) & 1)
            },
            getClockinVisual() {
                if (!window.sessionStorage.getItem("clockindatas")) {
                    this.getRequest("/work/bench/clockinvisual").then(resp => {
                        if (resp) {
                            this.clockindatas = resp;
                            window.sessionStorage.setItem("clockindatas", JSON.stringify(resp));
                            this.$nextTick(() => {
                                this.makePieCharts();
                            });
                        }
                    });
                } else {
                    this.clockindatas = JSON.parse(window.sessionStorage.getItem("clockindatas"));
                    this.$nextTick(() => {
                        this.makePieCharts();
                    });
                }
            },
            getAppattVisual() {
                if (!window.sessionStorage.getItem("appattdatas")) {
                    this.getRequest("/work/bench/appattvisual").then(resp => {
                        if (resp) {
                            this.appattdatas = resp;
                            window.sessionStorage.setItem("appattdatas", JSON.stringify(resp));
                            this.$nextTick(() => {
                                this.makeRadarCharts();
                            });
                        }
                    });
                } else {
                    this.appattdatas = JSON.parse(window.sessionStorage.getItem("appattdatas"));
                    this.$nextTick(() => {
                        this.makeRadarCharts();
                    });
                }
            },
            getEmpstaVisual() {
                if (!window.sessionStorage.getItem("empstadatas")) {
                    this.getRequest("/work/bench/empstavisual").then(resp => {
                        if (resp) {
                            this.empstadatas = resp;
                            window.sessionStorage.setItem("empstadatas", JSON.stringify(resp));
                            this.$nextTick(() => {
                                this.makeBarCharts();
                            });
                        }
                    });
                } else {
                    this.empstadatas = JSON.parse(window.sessionStorage.getItem("empstadatas"));
                    this.$nextTick(() => {
                        this.makeBarCharts();
                    });
                }
            },
            getEmpsalVisual() {
                if (!window.sessionStorage.getItem("empsaldatas")) {
                    this.getRequest("/work/bench/empsalvisual").then(resp => {
                        if (resp) {
                            this.empsaldatas = resp;
                            window.sessionStorage.setItem("empsaldatas", JSON.stringify(resp));
                            this.$nextTick(() => {
                                this.makeAreaCharts();
                            });
                        }
                    });
                } else {
                    this.empsaldatas = JSON.parse(window.sessionStorage.getItem("empsaldatas"));
                    this.$nextTick(() => {
                        this.makeAreaCharts();
                    });
                }
            },
            makePieCharts() {
                const piePlot = new this.Pie(document.getElementById('clockinvisual'), {
                    forceFit: true,
                    title: {
                        visible: true,
                        text: '今日员工考勤打卡统计图',
                    },
                    description: {
                        visible: true,
                        text: '自动统计今日的打卡数据',
                    },
                    radius: 0.8,
                    data: this.clockindatas,
                    angleField: 'value',
                    colorField: 'type',
                    label: {
                        visible: true,
                        type: 'outer-center',
                    },
                    legend: {
                        visible: true,
                        position: 'right-center',
                        flipPage: true,
                        offsetX: -5,
                    },
                });
                piePlot.render();
            },
            makeRadarCharts() {
                const radarPlot = new this.Radar(document.getElementById('appattvisual'), {
                    forceFit: true,
                    title: {
                        visible: true,
                        text: '事务申请统计',
                    },
                    description: {
                        visible: true,
                        text: '统计今日的事务申请',
                    },
                    data: this.appattdatas,
                    angleField: 'type',
                    radiusField: '人数',
                    radiusAxis: {
                        grid: {
                            alternateColor: ['rgba(0, 0, 0, 0.04)', null],
                        },
                    },
                    line: {
                        visible: true,
                    },
                    point: {
                        visible: true,
                        shape: 'circle',
                    },
                    legend: {
                        visible: true,
                        position: 'bottom-center',
                    },
                });
                radarPlot.render();
            },
            makeBarCharts() {
                const barPlot = new this.Bar(document.getElementById('empstavisual'), {
                    barStyle: {
                        fill: 'l(0) 0:#1AE6E6 1:#1890ff'
                    },
                    title: {
                        visible: true,
                        text: '员工任职状态图',
                    },
                    description: {
                        visible: true,
                        text:
                            '公司生涯的员工任职状态统计图',
                    },
                    forceFit: true,
                    data: this.empstadatas,
                    xField: '人数',
                    yField: '状态',
                    meta: {
                        人数: {
                            alias: '总人数',
                        },
                        状态: {
                            alias: '任职状态',
                            formatter: (v) => {
                                return `${v}：`
                            }
                        }
                    },
                    legend: {
                        visible: true,
                        position: 'top-center',
                    },
                    label: {
                        visible: true,
                        position: 'right',
                        formatter: (v) => (v) + ' 人',
                    },
                });

                barPlot.render();
            },
            makeAreaCharts() {
                const areaPlot = new this.Area(document.getElementById('empsalvisual'), {
                    data: this.empsaldatas,
                    areaStyle:{
                        fill: 'l(90) 0:#5B8FF9 1:#ffffff',
                    },
                    title: {
                        visible: true,
                        text: '员工薪资分布图',
                    },
                    description: {
                        visible: true,
                        text: '用平滑的曲线代替折线。',
                    },
                    xAxis: {
                        visible: true,
                        type: 'dateTime',
                        tickCount: 11,
                    },
                    forceFit: true,
                    smooth: true,
                    xField: '区间',
                    yField: '人数',
                    meta: {
                        区间: {
                            alias:'年份',
                        },
                        人数: {
                            alias: '数量',
                            formatter:(v)=>{return `${v} 人`}
                        }
                    },
                });
                areaPlot.render();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .calendar{
        width: 30%;
        .choose_year{
            display: flex;
            .icon{
                width: 10%;
                height: 8vh;
                line-height: 8vh;
                text-align: center;
            }
            .date{
                width: 60%;
                text-align: center;
                height: 8vh;
                line-height: 8vh;
                font-size: 1.2rem;
            }
        }
        .days_area{
            display: flex;
            flex-wrap: wrap;
            .day{
                width: 14.28%;
                text-align: center;
                padding: 0.5vh 0;
                margin-top: 0.5vh;
                p{
                    margin: 0;
                    font-size: 1.3vw;
                }
                span{
                    font-size: 1.5vh;
                }
            }
            .week{
                background-color: rgb(202, 237, 255);
                color: #888;
                font-weight: bold;
                height: 4vh;
                line-height: 4vh;
                margin: 0;
            }
            .holiday{
                color: #e30007;
            }
            .choose_day{
                background-color: #19aa8d;
                color: #fff;
                font-weight: bold;
            }
        }
    }
</style>