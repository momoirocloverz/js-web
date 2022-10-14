import Vue from "vue";
import Dayjs from "dayjs";
var duration = require("dayjs/plugin/duration");
Dayjs.extend(duration);

Vue.prototype.Dayjs = Dayjs;
