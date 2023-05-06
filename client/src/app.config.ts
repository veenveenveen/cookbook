export default {
  pages: [
    'pages/home/index',
    'pages/index/index',
    'pages/mine/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    "backgroundColor": "#fafafa",
    "borderStyle": "white",
    "selectedColor": "#FF7000",
    "color": "#A7BDCC",
    "list": [
      {
        "pagePath": "pages/home/index",
        "iconPath": "assets/images/icon_tab_home.png",
        "selectedIconPath": "assets/images/icon_tab_home_selected.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/index/index",
        "iconPath": "assets/images/icon_tab_order.png",
        "selectedIconPath": "assets/images/icon_tab_order_selected.png",
        "text": "订单"
      },
      {
        "pagePath": "pages/mine/index",
        "iconPath": "assets/images/icon_tab_mine.png",
        "selectedIconPath": "assets/images/icon_tab_mine_selected.png",
        "text": "我的"
      }
    ]
  },
  cloud: true
}
