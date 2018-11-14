
(function ($) {
  var initializing = false,
    fnTest = /xyz/.test(function () {
      xyz;
    }) ? /\b_super\b/ : /.*/;

  var Class = function () {};
  Class.extend = function (prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function (name, fn) {
          return function () {
            var tmp = this._super;

            this._super = _super[name];

            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    function Class() {
      if (!initializing && this.init)
        this.init.apply(this, arguments);
    }
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };
  $.Class = Class;
})($);

(function ($, window, document) {
  var UserList = $.UserList = function (holder, items) {
    var self = this
    self.holder = holder
    self.items = []
    self.selectList = items.selectList || []
    self.user = items.user || []
    self.init()

  }

  UserList.prototype.findElementItems = function () {
    var self = this
    self.elementItems = [].slice.call(self.holder.querySelectorAll('li'))
    return self.elementItems
  }

  UserList.prototype.init = function () {
    var self = this
    self.list = self.holder.querySelector('ul')
    self.findElementItems()

  }

  UserList.prototype.triggerChange = function () {
    var self = this
    var checkboxAll = [].slice.call(self.holder.querySelectorAll('input[type=checkbox]'))
    var selectList = self.selectList

    for (var item in checkboxAll) {
      var checkbox = checkboxAll[item]
      var val = checkbox.value
      for ( var select in selectList) {
        if(selectList[select].userid === val) {
          if(!checkbox.checked) {
            $(checkbox).click()
          }
        }
      }
    }
  }

  UserList.prototype.setUserItems = function (items) {
    var self = this
    self.items = items || []
    var buffer = []
    self.items.forEach(function (item) {
      if (item) {
        var itemDom = '<li class="zx-picker-list-item">\
              <div class="item-img-box">\
                <img src="' + item.imgurl + '" >\
              </div>\
              <div class="item-content item-checkbox ellipsis">\
                <input type="checkbox" class="zx-checked" name="checkbox1" value="'+ item.userid +'" data-name="' + item.nickname + '" data-img="' + item.imgurl + '">\
                <span>' + item.nickname + '</span>\
              </div>\
            </li>'
        buffer.push(itemDom)
      }
    })
    self.list.innerHTML = buffer.join('')
    self.findElementItems()
    self.triggerChange()
  }

  UserList.prototype.setAllUserItems = function (item) {
    var self = this
    self.items = item || []
    var buffer = []
    initials(self, item)

  }

  UserList.prototype.setSelectedUserItem = function () {
    var self = this
    console.log(self)
    for(var index in self.selectList) {
      var item = self.selectList[index]

    }


  }

  UserList.prototype.getSelectedUserItem = function () {
    var self = this
    var checkboxArray = [].slice.call( self.holder.querySelectorAll('input[type="checkbox"]'))
		var checkedValues = []
    checkboxArray.forEach(function(box) {
      if (box.checked) {
        var obj = {
          nickname: $(box).attr('data-name'),
          imgurl: $(box).attr('data-img'),
          userid: $(box).val()
        }
        checkedValues.push(obj)
      }
    })
    return checkedValues
  }

  UserList.prototype.getSelectedAllItem = function () {
    var self = this
    return self.items
  }

  UserList.prototype.getSelectedItems = function () {
    var self = this
    return self.items
  }

  if ($.fn) {
		$.fn.tab = function(options) {
      this.each(function(i, element) {
        if (element.tab) {
          return
        }
        if (options) {
          element.tab = new UserList(element, options)
        } else {
          element.tab = new UserList(element)
        }
      })	
      return this[0] ? this[0].tab : null;
		}

		//自动初始化
		$(function() {
			$('.zx-tab-content').tab()
		})
  }
  
  // 递归函数
  function deepLoop(arr) {
    if($.isArray(arr)) {
      var deepArr = []
      for(item in arr) {
        if(arr[item].nodetype == 'user') {
          deepArr.push(arr[item])
        }else {
          deepLoop(arr[item].children)
        }
      }
    }
    return deepArr
  }

  // 全部人员排序
  function initials(self, items) { 
    var buffer = []
    var $SortBox = $(self.list)
    var sortItems = items.sort(asc_sort) // 按首字母排序
    var caseItems = []
    sortItems.forEach(function (item) {
      if (item) {
        var labelDom = ''
        var itemDom = '<li class="zx-picker-list-item">\
              <div class="item-img-box">\
                <img src="' + item.imgurl + '" >\
              </div>\
              <div class="item-content item-checkbox ellipsis">\
                <input type="checkbox" class="zx-checked" name="checkbox1" value="'+ item.userid +'" data-name="' + item.nickname + '" data-img="' + item.imgurl + '">\
                <span>' + item.nickname + '</span>\
              </div>\
            </li>'
        var caseItem = makePy(item.nickname.charAt(0).toUpperCase())[0]
        if (caseItem >= 'A' && caseItem <= 'Z') {
          if (caseItems.indexOf(caseItem) === -1) {
            labelDom = '<li class="zx-picker-list-item-label" data-id="'+caseItem+'">'+caseItem+'</li>'
            caseItems.push(caseItem)
          }
        } 
        buffer.push(labelDom + itemDom)
      }
    })
    $SortBox.html(buffer.join(''))
    self.findElementItems()
    self.triggerChange()

    function asc_sort(a, b) {
      return makePy(a.nickname.charAt(0).toUpperCase()) < makePy(b.nickname.charAt(0).toUpperCase()) ? -1 : 1
    }

  }

  // 对象数组去重方法
  function uniq(arr, key){
    let result = {};
     let finalResult=[];
     for(let i=0;i<arr.length;i++){
         result[ (arr[i])[key]]=arr[i];
     }

     for(item in result){
         finalResult.push(result[item]);
     }
     return finalResult;
  }
})($, window, document);


(function ($, document) {

  var panelBuffer = `<div class="zx-layout">
    <div class="zx-tab">
      <a class="zx-tab-item active" href="#tab-c">常用联系人</a>
      <a class="zx-tab-item" href="#tab-d">部门成员</a>
      <a class="zx-tab-item" href="#tab-a">全部成员</a>
    </div>
    <div class="zx-tab-container">
      <div class="zx-tab-content active" data-id="tab-c">
        <ul class="zx-picker-list">
          
        </ul>
      </div>
      <div class="zx-tab-content" data-id="tab-d">
        <ul class="zx-picker-list">
          
        </ul>
      </div>
      <div class="zx-tab-content" data-id="tab-a">
        <div class="zx-nav">
          <div class="zx-navbar active">
            <i class="zx-navbar-icon zxicon-zuzhi"></i>
            <p class="zx-navbar-content">按组织架构</p>
          </div>
          <div class="zx-navbar active">
            <i class="zx-navbar-icon zxicon-yonghuzu"></i>
            <p class="zx-navbar-content">按用户组</p>
          </div>
          <div class="zx-navbar active">
            <i class="zx-navbar-icon zxicon-jiaose"></i>
            <p class="zx-navbar-content">按角色</p>
          </div>
        </div>
        <ul class="zx-picker-list">
          
        </ul>
      </div>
    </div>
    <div class="zx-tab-footer">
      <button class="zx-btn zx-btn-default zx-tab-btn-ok" data-id="btn-cancel">取消</button>
      <span class="zx-tab-footer-txt">已选择<span class="zx-tab-footer-num">0</span>人</span>
      <button class="zx-btn zx-btn-info zx-tab-btn-ok" data-id="btn-ok">确定</button>
    </div>
  </div>`;

  // 定义弹出窗口类
  var PopTab = $.PopTab = $.Class.extend({
    init: function (options) {
      var self = this
      var _tab = $(panelBuffer)[0]
      $('body').append(_tab)
      $('[data-id*="tab"]', _tab).tab(options)
      var ui = self.ui = {
        tab: _tab,
        ok: $('[data-id="btn-ok"]', _tab)[0],
        cancel: $('[data-id="btn-cancel"]', _tab)[0],
        title: $('.zx-tab', _tab)[0],
        body: $('.zx-tab-container', _tab)[0],
        txt: $('.zx-tab-footer-txt', _tab)[0],
        num: $('.zx-tab-footer-num', _tab)[0],
        c: $('[data-id="tab-c"]', _tab)[0],
        d: $('[data-id="tab-d"]', _tab)[0],
        a: $('[data-id="tab-a"]', _tab)[0],
      }


      ui.title.addEventListener('click', function(e) {
        e.preventDefault()
        var targetBody
        var className = 'active'
        var CLASS_TAB_ITEM = 'zx-tab-item'
        var CLASS_TAB_CONTENT = 'zx-tab-content'
        var classSelector = '.' + className
        var _self = this
        var target = e.target || e.srcElement
        var tabItems = _self.querySelector('.' + CLASS_TAB_ITEM)
        var activeTab = _self.querySelector(classSelector + '.' + CLASS_TAB_ITEM)
        if(activeTab) {
          activeTab.classList.remove(className)
        }
        target.classList.add(className)
        var hash = target.hash.replace('#', '')
        targetBody = $('[data-id="'+hash+'"]', self.ui.body)[0]
        var parentNode = targetBody.parentNode
        activeBodies = parentNode.querySelectorAll('.' + CLASS_TAB_CONTENT + classSelector)
        for (var i = 0; i < activeBodies.length; i++) {
          var activeBody = activeBodies[i]
          activeBody.parentNode === parentNode && activeBody.classList.remove(className)
        }
        targetBody.classList.add(className)
        $(targetBody).tab().triggerChange()
      })

      ui.body.addEventListener('change', function(e) {
        var checkedValues = []
        var selectArray = [].slice.call(ui.body.querySelectorAll('input[type="checkbox"]:checked'))
        selectArray.forEach(function(box) {
          if (box.checked) {
            var obj = {
              nickname: $(box).attr('data-name'),
              imgurl: $(box).attr('data-img'),
              userid: $(box).val()
            }
            checkedValues.push(obj)
          }
        })
        var setCheck = uniq(checkedValues, 'userid')

        $(ui.c).tab().selectList = setCheck
        $(ui.d).tab().selectList = setCheck
        $(ui.a).tab().selectList = setCheck
        
        var count = setCheck.length
        if(count) {
          ui.txt.classList.add('active')
          ui.num.innerText = count
        } else {
          ui.txt.classList.remove('active')
          ui.num.innerText = 0
        }
        
      })

      ui.cancel.addEventListener('click', function (event) {
        self.hide()
      }, false)

      ui.ok.addEventListener('click', function (event) {
        if (self.callback) {
          var rs = self.callback(self.getSelected())
          if (rs !== false) {
            self.hide()
          }
        }
      }, false)
      self._create(options)
    },
    getSelected: function() {
      var self = this
      var ui = self.ui
      var selected = {
        selectList: ui.c.tab.selectList
      }
      return selected
    },
    _createConcacts: function () {
      var self = this
      var ui = self.ui
      $.ajax({
        url: 'dept.json',
        methods: 'GET',
        data: {
          access_token: '81bcd198-8a13-490c-89e3-133cca4375d8'
        },
        success: function(res) {
          if($.isArray(res)) {
            ui.c.tab.setUserItems(res)
          }
        }
      }) 
    },
    _createDepartment: function () {
      var self = this
      var ui = self.ui
      $.ajax({
        url: 'dept.json',
        methods: 'GET',
        data: {
          access_token: '81bcd198-8a13-490c-89e3-133cca4375d8'
        },
        success: function(res) {
          if($.isArray(res)) {
            ui.d.tab.setUserItems(res)
          }
        }
      }) 
    },
    _createAllUsers: function () {
      var self = this
      var ui = self.ui
      $.ajax({
        url: 'alluser.json',
        methods: 'GET',
        data: {
          access_token: '81bcd198-8a13-490c-89e3-133cca4375d8'
        },
        success: function(res) {
          if($.isArray(res)) {
            var loopArr = deepLoop(res, [])
            ui.a.tab.setAllUserItems(loopArr)
          }
        }
      }) 
      
    },
    _create: function (options) {
      var self = this
      options = options || {}
      self.options = options
      var ui = self.ui
      self._createConcacts()
      self._createDepartment()
      self._createAllUsers()
    },
    //显示
    show: function (callback) {
      var self = this;
      self.callback = callback;
      var tab = self.ui.tab
      $(tab).addClass('active')
    },
    //隐藏
    hide: function () {
      var self = this
      if (self.disposed) return
      var tab = self.ui.tab
      $(tab).removeClass('active')
    },
    dispose: function () {
      var self = this
      self.hide()
      setTimeout(function () {
        self.ui.tab.parentNode.removeChild(self.ui.tab)
        for (var name in self) {
          self[name] = null;
          delete self[name]
        }
        self.disposed = true
      }, 300)
    }
  });

  // 递归函数
  function deepLoop(arr, deepArr) {
    if($.isArray(arr)) {
      for(item in arr) {
        if(arr[item].nodetype != 'user') {
          deepLoop(arr[item].children, deepArr)
        }else {
          deepArr.push(arr[item])
        }
      }
    }
    return deepArr
  }

  // 对象数组去重方法
  function uniq(arr, key){
    let result = {};
     let finalResult=[];
     for(let i=0;i<arr.length;i++){
         result[(arr[i])[key]]=arr[i];
     }

     for(item in result){
         finalResult.push(result[item]);
     }
     return finalResult;
  }
})($, document);