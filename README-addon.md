# 1.项目名称：web

# 2.项目分支 dev/pre/master

# 3.关于上架平台说明，目前已经上线了网页端

# 4.关于部署发布

## 本项目使用 nuxt，发布时需要自行 generate 并提交代码

# 5.关于文件结构

## 1.细分结构 layouts/XXX 内部说明

### 页面容器以及加载遮罩动画

## 2.细分结构 static/mapModule 内部说明

### gis 地图静态依赖文件

## 3.细分结构 nuxt.config.js 内部说明

### plugins 引用本地封装插件， postcss.plugins.postcss-px2rem-exclude 配置页面自适应相关

## 4.细分结构 plugin/apiList 内部说明

### axios 请求

## 5.细分结构 plugins/flexible 内部说明

### 页面自适应插件

## 6.细分结构 pages/understand/detail 内部说明

### 语音播报 检测环境是否支持原生 api,分别使用原生 api 和百度语音服务

## 7.细分结构 pages/policy/detail 内部说明

### 相关页面跳转，地区选择功能，竞争性财政已经添加选择本级功能，惠农补贴及其他 暂未添加

## 8.细分结构 store/index 内部说明

### tab 激活状态

# 6.备注

## 1.静态文件不能使用 /web/ 路径，正式服务会有问题
