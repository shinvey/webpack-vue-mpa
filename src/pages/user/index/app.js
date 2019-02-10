import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './app.vue';

Vue.use(ElementUI);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App)
});
